package com.e_commerce.the_hardware_vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "characteristic")
public class Characteristic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @OneToMany(mappedBy = "characteristic", orphanRemoval = true)
    private Set<CharacteristicValue> characteristicValues = new LinkedHashSet<>();

}