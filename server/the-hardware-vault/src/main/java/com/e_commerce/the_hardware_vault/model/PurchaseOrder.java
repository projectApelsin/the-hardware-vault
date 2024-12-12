package com.e_commerce.the_hardware_vault.model;

import com.e_commerce.the_hardware_vault.api.Enum.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
@Entity
@Table(name = "purchase_order")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(name = "postal_office", nullable = false)
    private String postalOffice;

    @Column(name = "delivery_method", nullable = false)
    private String deliveryMethod;

    @Column(name = "city", nullable = false)
    private String city;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToMany
    @JoinTable(
            name = "purchased_products",
            joinColumns = @JoinColumn(name = "purchase_order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Collection<Product> purchasedProducts = new ArrayList<>();

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "liqpay_order_id", unique = true, nullable = false)
    private String liqpayOrderId;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

}