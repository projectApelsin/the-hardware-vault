package com.e_commerce.the_hardware_vault.service;


import com.e_commerce.the_hardware_vault.api.DTO.product.PurchaseOrderDTO;
import com.e_commerce.the_hardware_vault.api.Enum.OrderStatus;
import com.e_commerce.the_hardware_vault.model.Customer;
import com.e_commerce.the_hardware_vault.model.Product;
import com.e_commerce.the_hardware_vault.model.PurchaseOrder;
import com.e_commerce.the_hardware_vault.model.repository.CustomerRepository;
import com.e_commerce.the_hardware_vault.model.repository.ProductRepository;
import com.e_commerce.the_hardware_vault.model.repository.PurchaseOrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class PurchaseOrderService {


    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PurchaseOrderRepository orderRepository;

    @Value("${liqpay.public_key}")
    private String publicKey;

    @Value("${liqpay.private_key}")
    private String privateKey;

    public Map<String, String> createPurchaseOrderAndPayment(PurchaseOrderDTO purchaseOrderDTO) throws Exception {
        // 1. Створення замовлення
        PurchaseOrder po = new PurchaseOrder();
        po.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        po.setOrderStatus(OrderStatus.AWAITING_PAYMENT);



        Collection<Product> purchasedProducts = new ArrayList<>();

        purchaseOrderDTO.getPurchaseProductsId().forEach(product->{
            purchasedProducts.add(productRepository.findById(product).get());
        });
        po.setPurchasedProducts(purchasedProducts);
        po.setCity(purchaseOrderDTO.getCity());
        po.setDeliveryMethod(purchaseOrderDTO.getDeliveryMethod());
        po.setPostalOffice(purchaseOrderDTO.getPostalOffice());

        po.setCustomer(customerRepository.findById(purchaseOrderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Користувач не знайдений")));
        po.setAmount(purchaseOrderDTO.getPrice());

        // Генерація унікального liqpayOrderId
        String liqpayOrderId = "order_" + System.currentTimeMillis();
        po.setLiqpayOrderId(liqpayOrderId);
        Customer customer = customerRepository.findById(purchaseOrderDTO.getCustomerId()).get();

        purchaseOrderDTO.getPurchaseProductsId().forEach(product->{
            customer.getShoppingCart().remove(product);
        });

        customerRepository.save(customer);
        PurchaseOrder savedOrder = orderRepository.save(po);

        // 2. Підготовка даних для LiqPay
        Map<String, String> params = new HashMap<>();
        params.put("version", "3");
        params.put("public_key", publicKey);
        params.put("action", "pay");
        params.put("amount", purchaseOrderDTO.getPrice().toString());
        params.put("currency", "UAH");
        params.put("description", "Замовлення №" + savedOrder.getId());
        params.put("order_id", savedOrder.getLiqpayOrderId()); // Використовуємо liqpayOrderId
        params.put("server_url", "https://backend-production-e7c9.up.railway.app/api/customer/order/callback");

        // 3. Генерація даних для форми LiqPay
        String data = Base64.getEncoder()
                .encodeToString(new ObjectMapper().writeValueAsString(params).getBytes());
        String signature = createSignature(privateKey + data + privateKey);

        Map<String, String> paymentData = new HashMap<>();
        paymentData.put("data", data);
        paymentData.put("signature", signature);

        return paymentData;
    }
    public void updateOrderStatus(String liqpayOrderId, OrderStatus status) {
        PurchaseOrder order = orderRepository.findByLiqpayOrderId(liqpayOrderId)
                .orElseThrow(() -> new RuntimeException("Замовлення не знайдено: " + liqpayOrderId));
        order.setOrderStatus(status);
        orderRepository.save(order);
    }

    private String createSignature(String data) throws Exception {
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-1");
        byte[] hash = md.digest(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    public void cleanCart(String orderId) {
        Customer customer = orderRepository.findByLiqpayOrderId(orderId).get().getCustomer();
        Map<Integer,Integer> shoppingCart = customer.getShoppingCart();
        shoppingCart.clear();
        customer.setShoppingCart(shoppingCart);
        customerRepository.save(customer);
    }
}
