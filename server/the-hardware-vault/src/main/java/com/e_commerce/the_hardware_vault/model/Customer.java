package com.e_commerce.the_hardware_vault.model;

import com.e_commerce.the_hardware_vault.api.Enum.AuthorityRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false, unique = true, length = 12)
    private String phoneNumber;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;


    @OneToMany(mappedBy = "customer", orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "customer", orphanRemoval = true)
    private Set<PurchaseOrder> purchaseOrders = new LinkedHashSet<>();


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "customer_wishlist", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "product_id")
    private Collection<Integer> wishlist = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "authority_role", nullable = false, length = 30)
    private AuthorityRole authorityRole;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "customer_shopping_cart", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "product_id")
    private Map<Integer, Integer> shoppingCart = new HashMap<>();


}