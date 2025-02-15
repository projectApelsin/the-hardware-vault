package com.e_commerce.the_hardware_vault.model.repository;

import com.e_commerce.the_hardware_vault.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("""
    SELECT p
    FROM Product p
    WHERE p.category.id = (
        SELECT p2.category.id
        FROM Product p2
        WHERE p2.id = :productId
    )
    AND p.id != :productId
""")
    Page<Product> findSimilarProductsById(@Param("productId") Integer productId, Pageable pageable);


    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
    Page<Product> findAllByTitleLike(@Param("searchQuery") String searchQuery, Pageable pageable);

    @Query("""
    SELECT p 
    FROM Product p 
    JOIN p.purchaseProducts po 
    WHERE po.orderStatus = 'PAID' 
    GROUP BY p.id 
    ORDER BY COUNT(po.id) DESC
""")
    Page<Product> findPopularProducts(Pageable pageable);

    // Товары со скидками
    @Query("""
        SELECT p 
        FROM Product p 
        WHERE p.discountPercent > 0 
        ORDER BY p.discountPercent DESC
    """)
    Page<Product> findDiscountedProducts(Pageable pageable);

    @Query("""
    SELECT p
    FROM Product p
    WHERE p.category.id = :categoryId
    AND (CASE WHEN p.discountPercent > 0 THEN p.price * (1 - p.discountPercent / 100.0) ELSE p.price END) <= :budget
    ORDER BY p.rating DESC
""")
    Page<Product> findProductsByCategoryAndBudget(@Param("categoryId") Integer categoryId,
                                                  @Param("budget") Integer budget,
                                                  Pageable pageable);


    @Query("""
    SELECT cv.id 
    FROM PurchaseOrder po
    JOIN po.purchasedProducts pr
    JOIN pr.characteristicValues cv
    WHERE po.customer.id = :customerId
    AND pr.category.id = :categoryId
    GROUP BY cv.id
    ORDER BY COUNT(cv.id) DESC
""")
    List<Integer> findTopCharacteristicByCustomerAndCategory(@Param("customerId") Integer customerId,
                                                             @Param("categoryId") Integer categoryId);


    @Query("""
    SELECT p
    FROM Product p
    JOIN p.characteristicValues cv
    WHERE p.category.id = :categoryId
    AND (CASE WHEN p.discountPercent > 0 THEN p.price * (1 - p.discountPercent / 100.0) ELSE p.price END) <= :budget
    AND cv.id = :characteristicId
    ORDER BY p.rating DESC
""")
    Page<Product> findRecommendedByCharacteristic(@Param("categoryId") Integer categoryId,
                                                  @Param("budget") Integer budget,
                                                  @Param("characteristicId") Integer characteristicId,
                                                  Pageable pageable);

    @Query("""
    SELECT p 
    FROM Product p 
    WHERE p.category.id = :categoryId
""")
    Page<Product> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    @Query("""
    SELECT p 
    FROM Product p 
    WHERE (CASE WHEN p.discountPercent > 0 THEN p.price * (1 - p.discountPercent / 100.0) ELSE p.price END) <= :budget
    ORDER BY p.rating DESC
""")
    Page<Product> findProductsByBudget(@Param("budget") Integer budget, Pageable pageable);


}