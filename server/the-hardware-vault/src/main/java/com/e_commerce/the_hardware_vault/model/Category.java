package com.e_commerce.the_hardware_vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title", nullable = false, unique = true, length = 20)
    private String title;

    @OneToMany(mappedBy = "category", orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

}