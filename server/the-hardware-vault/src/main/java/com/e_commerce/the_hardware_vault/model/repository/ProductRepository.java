package com.e_commerce.the_hardware_vault.model.repository;

import com.e_commerce.the_hardware_vault.model.Product;
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
    List<Product> findSimilarProductsById(@Param("productId") Integer productId, Pageable pageable);


    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
    List<Product> findAllByTitleLike(@Param("searchQuery") String searchQuery);

    @Query("""
    SELECT p FROM Product p
    LEFT JOIN Customer c ON c.id = :customerId
    WHERE (:customerId IS NULL OR p.productInfo.id = c.productInfo.id)
    ORDER BY CASE WHEN p.productInfo.id = c.productInfo.id THEN 1 ELSE 2 END
""")
    List<Product> findRecommendedProducts(@Param("customerId") Integer customerId);

    @Query("""
    SELECT p FROM Product p
    WHERE p.discountPercent > 0
""")
    List<Product> findDiscountedProducts();


    @Query("""
    SELECT p FROM Product p
    LEFT JOIN p.purchaseProducts pp
    GROUP BY p.id
    ORDER BY COUNT(pp.id) DESC
""")
    List<Product> findPopularProducts();

}