package com.e_commerce.the_hardware_vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title", nullable = false, length = 50)
    private String title;


    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "short_description", nullable = false, length = 500)
    private String shortDescription;

    @Column(name = "main_image", nullable = false)
    private String mainImage;

    @Column(name = "card_image", nullable = false)
    private String cardImage;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToMany
    @JoinTable(name = "product_characteristicValues",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "characteristicValues_id"))
    private Set<CharacteristicValue> characteristicValues = new LinkedHashSet<>();

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "cart_image", nullable = false)
    private String cartImage;


    @OneToMany(mappedBy = "product", orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();



    @Transient
    public Integer getAverageRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 0; // Возвращаем 0, если отзывов нет
        }

        // Рассчитываем средний рейтинг
        double average = reviews.stream()
                .mapToInt(Review::getRating) // Предполагается, что в `Review` есть поле `rating`
                .average()
                .orElse(0);

        // Округляем до ближайшего целого числа и приводим к диапазону 1–5
        return Math.max(1, Math.min(5, (int) Math.round(average)));
    }

    @Column(name = "discount_percent", nullable = false, precision = 19, scale = 2)
    private BigDecimal discountPercent;

    @ManyToMany(mappedBy = "purchasedProducts")
    private Collection<PurchaseOrder> purchaseProducts = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_other_picture_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "picture_url", length = 255)
    private List<String> otherPictureUrl = new ArrayList<>();

}