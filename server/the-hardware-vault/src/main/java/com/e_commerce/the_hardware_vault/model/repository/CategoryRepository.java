package com.e_commerce.the_hardware_vault.model.repository;

import com.e_commerce.the_hardware_vault.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}