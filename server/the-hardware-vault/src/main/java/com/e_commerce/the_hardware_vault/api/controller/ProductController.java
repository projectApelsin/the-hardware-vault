package com.e_commerce.the_hardware_vault.api.controller;


import com.e_commerce.the_hardware_vault.api.DTO.ReviewDTO;
import com.e_commerce.the_hardware_vault.service.CustomerService;
import com.e_commerce.the_hardware_vault.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private CustomerService customerService;

    @GetMapping("/public/getReviews/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok().body(productService.getReviewsByProduct(productId));
    }

    @PostMapping("/customer/addReview/{productId}")
    public ResponseEntity<?> addReviewForProduct(@PathVariable Integer productId,
                                                 @RequestBody ReviewDTO reviewDTO,
                                                 HttpServletRequest request) {
        Integer customerId = customerService.getCustomerIdFromRequest(request);
        return productService.addReviewForProduct(productId, reviewDTO, customerId);
    }
}