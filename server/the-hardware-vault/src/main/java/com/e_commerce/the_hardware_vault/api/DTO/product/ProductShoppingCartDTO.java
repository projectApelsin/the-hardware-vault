package com.e_commerce.the_hardware_vault.api.DTO.product;

import lombok.Data;

@Data
public class ProductShoppingCartDTO {

    private Integer id;

    private String image;

    private String title;


    private Integer price;

    private Integer amount;
}
