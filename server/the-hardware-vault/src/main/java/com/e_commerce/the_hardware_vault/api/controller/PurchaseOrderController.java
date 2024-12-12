package com.e_commerce.the_hardware_vault.api.controller;


import com.e_commerce.the_hardware_vault.api.DTO.product.PurchaseOrderDTO;
import com.e_commerce.the_hardware_vault.api.Enum.OrderStatus;
import com.e_commerce.the_hardware_vault.service.CustomerService;
import com.e_commerce.the_hardware_vault.service.JwtService;
import com.e_commerce.the_hardware_vault.service.PurchaseOrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class PurchaseOrderController {


    private final PurchaseOrderService purchaseOrderService;

    private final JwtService jwtService;
    private final CustomerService customerService;

    @Value("${liqpay.public_key}")
    private String publicKey;

    @Value("${liqpay.private_key}")
    private String privateKey;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService, JwtService jwtService, CustomerService customerService) {
        this.purchaseOrderService = purchaseOrderService;
        this.jwtService = jwtService;
        this.customerService = customerService;
    }


    // Метод для создания подписи
    private String createSignature(String data) throws Exception {
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-1");
        byte[] hash = md.digest(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    @PostMapping("/createOrder")
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrderDTO purchaseOrderDTO, HttpServletRequest request) {
        try {

            purchaseOrderDTO.setCustomerId(customerService.getCustomerIdFromRequest(request));
            Map<String, String> paymentData = purchaseOrderService.createPurchaseOrderAndPayment(purchaseOrderDTO);

            return ResponseEntity.ok(paymentData); // Повертаємо { data, signature }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Помилка створення замовлення: " + e.getMessage());
        }
    }


    @PostMapping("/order/callback")
    public ResponseEntity<?> handleCallback(@RequestParam String data, @RequestParam String signature) {
        try {
            // Перевірка підпису
            String calculatedSignature = createSignature(privateKey + data + privateKey);
            if (!calculatedSignature.equals(signature)) {
                return ResponseEntity.status(401).body("Некоректна підпис");
            }

            // Розкодування даних
            if (data == null || data.isEmpty()) {
                return ResponseEntity.badRequest().body("Помилка обробки callback: відсутні дані.");
            }

            String decodedData = new String(Base64.getDecoder().decode(data));
            System.out.println("Callback data: " + decodedData);

            // Мапимо JSON у Map
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> callbackData = objectMapper.readValue(decodedData, Map.class);

            // Перевірка необхідних полів
            if (!callbackData.containsKey("order_id") || !callbackData.containsKey("status")) {
                return ResponseEntity.badRequest().body("Помилка обробки callback: відсутні обов'язкові поля.");
            }

            // Отримання інформації з callback
            String orderId = (String) callbackData.get("order_id");
            String status = (String) callbackData.get("status");

            // Логіка обробки статусів
            if ("success".equalsIgnoreCase(status)) {
                purchaseOrderService.updateOrderStatus(orderId, OrderStatus.PAID);
                purchaseOrderService.cleanCart(orderId);

            } else if ("failure".equalsIgnoreCase(status)) {
                purchaseOrderService.updateOrderStatus(orderId, OrderStatus.FAILED);
            } else if ("processing".equalsIgnoreCase(status)) {
                purchaseOrderService.updateOrderStatus(orderId, OrderStatus.AWAITING_PAYMENT);
            }

            return ResponseEntity.ok("Callback оброблено успішно");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Помилка обробки callback: " + e.getMessage());
        }
    }

}
