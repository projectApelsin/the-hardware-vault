package com.e_commerce.the_hardware_vault.api.DTO.filter;

import lombok.Data;

import java.util.List;

@Data
public class CharacteristicFilterDTO {

    private String characteristicName;

    private List<CharacteristicValueDTO> values;
}
