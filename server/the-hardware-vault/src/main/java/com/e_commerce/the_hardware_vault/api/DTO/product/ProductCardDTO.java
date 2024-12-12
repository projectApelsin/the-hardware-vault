package com.e_commerce.the_hardware_vault.api.DTO.product;

import lombok.Data;

@Data
public class ProductCardDTO {

    private Integer id;

    private String image;

    private String title;

    private Integer discountPrice;

    private Integer price;

    private Integer rating;
}
