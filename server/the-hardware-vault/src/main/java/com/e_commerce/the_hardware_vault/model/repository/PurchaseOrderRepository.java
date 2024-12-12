package com.e_commerce.the_hardware_vault.model.repository;

import com.e_commerce.the_hardware_vault.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
}