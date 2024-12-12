package com.e_commerce.the_hardware_vault.api.controller;

import com.e_commerce.the_hardware_vault.api.DTO.product.ProductShoppingCartDTO;
import com.e_commerce.the_hardware_vault.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @PostMapping("/addToWishlist/{productId}")
    public ResponseEntity<?> addToWishlist(HttpServletRequest request, @PathVariable Integer productId) {
        if (productId == null || productId <= 0) {
            return ResponseEntity.badRequest().body("Invalid product ID");
        }

        customerService.addToWishlist(customerService.getCustomerIdFromRequest(request), productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @DeleteMapping("/deleteFromWishlist/{productId}")
    public ResponseEntity<?> deleteFromWishlist(HttpServletRequest request, @PathVariable Integer productId) {
        if (productId == null || productId <= 0) {
            return ResponseEntity.badRequest().body("Invalid product ID");
        }

        return ResponseEntity.ok(customerService.deleteFromWishlist(customerService.getCustomerIdFromRequest(request), productId));
    }
    @GetMapping("/isInWishlist/{productId}")
    public ResponseEntity<Boolean> isInWishlist(@PathVariable Integer productId){
        return ResponseEntity.ok().body(customerService.isInWishlist(productId));
    }

    @PostMapping("/addToShoppingCart/{productId}")
    public ResponseEntity<?> addToShoppingCart(HttpServletRequest request, @PathVariable Integer productId) {
        if (productId == null || productId <= 0) {
            return ResponseEntity.badRequest().body("Invalid product ID");
        }

        return ResponseEntity.ok(customerService.addToShoppingCart(customerService.getCustomerIdFromRequest(request), productId));
    }

    @DeleteMapping("/deleteFromShoppingCart/{productId}")
    public ResponseEntity<?> deleteFromShoppingCart(HttpServletRequest request, @PathVariable Integer productId) {
        if (productId == null || productId <= 0) {
            return ResponseEntity.badRequest().body("Invalid product ID");
        }

        return ResponseEntity.ok(customerService.deleteFromShoppingCart(customerService.getCustomerIdFromRequest(request), productId));
    }

    @PutMapping("/changeProductQuantity/{productId}/{value}")
    public ResponseEntity<?> changeQuantityProductInShoppingCart(HttpServletRequest request,
                                                                 @PathVariable Integer productId,
                                                                 @PathVariable Integer value) {
        if (productId == null || productId <= 0 || value == null) {
            return ResponseEntity.badRequest().body("Invalid product ID or quantity value");
        }

        if (value == 0) {
            return ResponseEntity.badRequest().body("Quantity change value cannot be zero");
        }

        return ResponseEntity.ok(customerService.changeQuantityProductInShoppingCart(customerService.getCustomerIdFromRequest(request),
                productId, value));
    }

    @GetMapping("/getProductsFromShoppingCart")
    public ResponseEntity<List<ProductShoppingCartDTO>>getProductFromShoppingCart(HttpServletRequest request){
        return ResponseEntity.ok().body(customerService.getProductsFromShoppingCart
                (customerService.getCustomerIdFromRequest(request)));
    }



}

