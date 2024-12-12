package com.e_commerce.the_hardware_vault.api.DTO.product;

import com.e_commerce.the_hardware_vault.api.Enum.GroupType;
import lombok.Data;

import java.util.List;

@Data
public class ProductGroupDTO {

    private Integer id;

    private String title;

    private List<ProductCardDTO> productCards;

    private GroupType groupType;
}
