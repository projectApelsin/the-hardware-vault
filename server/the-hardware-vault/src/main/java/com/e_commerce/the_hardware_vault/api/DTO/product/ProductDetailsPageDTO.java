package com.e_commerce.the_hardware_vault.api.DTO.product;

import lombok.Data;

import java.util.List;
@Data
public class ProductDetailsPageDTO {
    private String title;

    private String shortDescription;

    private Integer price;

    private String image;

    private Integer countReviews;

    private Integer rating;



    private List<String> otherImage;

    private String description;

    private List<CharacteristicDTO> characteristics;

    private ProductGroupDTO productGroup;

}
