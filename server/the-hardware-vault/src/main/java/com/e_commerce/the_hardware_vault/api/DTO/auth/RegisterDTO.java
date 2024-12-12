package com.e_commerce.the_hardware_vault.api.DTO.auth;

import lombok.Data;

@Data
public class RegisterDTO {


    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String confirmPassword;

    private String phoneNumber;
}
