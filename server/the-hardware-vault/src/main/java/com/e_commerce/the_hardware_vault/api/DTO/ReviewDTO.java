package com.e_commerce.the_hardware_vault.api.DTO;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReviewDTO {

    private String firstName;

    private Integer rating;

    private String reviewText;

    private Timestamp reviewDate;

}
