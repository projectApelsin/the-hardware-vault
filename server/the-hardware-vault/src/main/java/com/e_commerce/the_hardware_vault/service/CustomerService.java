package com.e_commerce.the_hardware_vault.service;


import com.e_commerce.the_hardware_vault.api.DTO.auth.RegisterDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductShoppingCartDTO;
import com.e_commerce.the_hardware_vault.api.Enum.AuthorityRole;
import com.e_commerce.the_hardware_vault.model.Customer;
import com.e_commerce.the_hardware_vault.model.Product;
import com.e_commerce.the_hardware_vault.model.repository.CustomerRepository;
import com.e_commerce.the_hardware_vault.model.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
public class CustomerService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductService productService;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));



        SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority("ROLE_" +
                customer.getAuthorityRole().name());


        return org.springframework.security.core.userdetails.User
                .withUsername(customer.getEmail())
                .password(customer.getPassword())
                .authorities(simpleGrantedAuthority) // Устанавливаем authorities
                .build();
    }

    public Integer getCustomerId(String email) {
        return customerRepository.findByEmail(email).get().getId();
    }

    public AuthorityRole getRoleByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return customer.getAuthorityRole();
    }


    private boolean isPassValid(String password) {
        return password.length() >= 8 &&
                password.matches(".*\\d.*") && // Должна быть хотя бы одна цифра
                password.matches(".*[A-Z].*"); // Должна быть хотя бы одна заглавная буква
    }

    /**
     * Регистрация нового пользователя.
     */
    public ResponseEntity<?> registerCustomer(RegisterDTO request) {
        if (!isPassValid(request.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body("Пароль должен содержать не менее 8 символов, включать цифры и заглавные буквы.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body("Пароли не совпадают.");
        }

        // Проверка уникальности пользователя
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Пользователь с таким именем уже существует.");
        }

        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Устанавливаем роль "CUSTOMER"
        customer.setAuthorityRole(AuthorityRole.CUSTOMER);

        customerRepository.save(customer);

        return ResponseEntity
                .status(201)
                .body("Пользователь успешно зарегистрирован!");
    }
    public ResponseEntity<String> addToWishlist(Integer customerId, Integer productId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        Collection<Integer> wishlist = customer.getWishlist();
        if (wishlist.contains(productId)) {
            return ResponseEntity.status(409).body("Product already in wishlist");
        }

        wishlist.add(productId);
        customer.setWishlist(wishlist);
        customerRepository.save(customer);
        return ResponseEntity.ok("Product added to wishlist");
    }

    public ResponseEntity<String> deleteFromWishlist(Integer customerId, Integer productId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        Collection<Integer> wishlist = customer.getWishlist();
        if (!wishlist.contains(productId)) {
            return ResponseEntity.status(404).body("Product not found in wishlist");
        }

        wishlist.remove(productId);
        customer.setWishlist(wishlist);
        customerRepository.save(customer);
        return ResponseEntity.ok("Product removed from wishlist");
    }

    public ResponseEntity<String> addToShoppingCart(Integer customerId, Integer productId, Integer quantity) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        Map<Integer, Integer> shoppingCart = customer.getShoppingCart();
        if (shoppingCart.containsKey(productId)) {
            return ResponseEntity.status(409).body("Product already in shopping cart");
        }

        shoppingCart.put(productId, quantity);
        customer.setShoppingCart(shoppingCart);
        customerRepository.save(customer);
        return ResponseEntity.ok("Product added to shopping cart");
    }

    public ResponseEntity<String> changeQuantityProductInShoppingCart(Integer customerId, Integer productId, Integer changeQuantity) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        Map<Integer, Integer> shoppingCart = customer.getShoppingCart();
        if (!shoppingCart.containsKey(productId)) {
            return ResponseEntity.status(404).body("Product not found in shopping cart");
        }

        int newQuantity = shoppingCart.get(productId) + changeQuantity;
        if (newQuantity <= 0) {
            return ResponseEntity.status(400).body("Quantity must be greater than 0");
        }

        shoppingCart.replace(productId, newQuantity);
        customer.setShoppingCart(shoppingCart);
        customerRepository.save(customer);
        return ResponseEntity.ok("Product quantity updated");
    }

    public ResponseEntity<String> deleteFromShoppingCart(Integer customerId, Integer productId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        Map<Integer, Integer> shoppingCart = customer.getShoppingCart();
        if (!shoppingCart.containsKey(productId)) {
            return ResponseEntity.status(404).body("Product not found in shopping cart");
        }

        shoppingCart.remove(productId);
        customer.setShoppingCart(shoppingCart);
        customerRepository.save(customer);
        return ResponseEntity.ok("Product removed from shopping cart");
    }

    public List<ProductShoppingCartDTO> getProductsFromShoppingCart(Integer customerId){
        Customer customer = customerRepository.findById(customerId).orElse(null);
        Map<Integer, Integer> shoppingCart = customer.getShoppingCart();
        List<ProductShoppingCartDTO> shoppingCartDTOList = new ArrayList<>();

        shoppingCart.forEach((productId, quantity) -> {
            Product product = productRepository.findById(productId).get();
            ProductShoppingCartDTO productDTO = new ProductShoppingCartDTO();
            productDTO.setId(productId);
            productDTO.setTitle(product.getTitle());
            if(product.getDiscountPercent().intValue() != 0){
                productDTO.setPrice(ProductService.calculateDiscountPrice(product.getPrice(),product.getDiscountPercent()));
            } else productDTO.setPrice(product.getPrice());
            productDTO.setImage(product.getCartImage());
            productDTO.setAmount(quantity);
            shoppingCartDTOList.add(productDTO);
        });
        return shoppingCartDTOList;
    }


    public Integer getCustomerIdFromRequest(HttpServletRequest request) {
        try {
            String token = jwtService.getTokenFromRequest(request);

            // Если токен отсутствует, возвращаем null
            if (token == null || token.isEmpty()) {
                return null;
            }

            // Извлекаем customerId из токена
            return jwtService.extractCustomerId(token, jwtService.getSECRET_KEY());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            // Логируем ошибку и возвращаем null
            System.err.println("Malformed JWT token: " + e.getMessage());
            return null;
        } catch (Exception e) {
            // Логируем любые другие возможные ошибки и возвращаем null
            System.err.println("Unexpected error while extracting customer ID: " + e.getMessage());
            return null;
        }
    }


    public Boolean isInWishlist(Integer productId, Integer customerId) {
        Customer customer = customerRepository.findById(customerId).get();
        return customer.getWishlist().contains(productId);
    }
}
