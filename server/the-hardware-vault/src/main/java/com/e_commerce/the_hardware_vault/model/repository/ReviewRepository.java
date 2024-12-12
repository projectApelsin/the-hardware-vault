package com.e_commerce.the_hardware_vault.model.repository;

import com.e_commerce.the_hardware_vault.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Integer findCountReviewsByProductId(@Param("productId") Integer productId);

    List<Review> findAllByProductId(Integer productId);

    boolean existsByProductIdAndCustomerId(Integer productId, Integer customerId);
}