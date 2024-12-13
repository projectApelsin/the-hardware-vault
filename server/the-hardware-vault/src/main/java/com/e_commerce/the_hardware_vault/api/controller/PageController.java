package com.e_commerce.the_hardware_vault.api.controller;

import com.e_commerce.the_hardware_vault.api.DTO.CategoryDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.CharacteristicFilterDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.CharacteristicValueDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.RecommendationFilterDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductCardDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductDetailsPageDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductGroupDTO;
import com.e_commerce.the_hardware_vault.service.CustomerService;
import com.e_commerce.the_hardware_vault.service.PageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PageController {


    @Autowired
    private CustomerService customerService;
    @Autowired
    private PageService pageService;

    @GetMapping("/public/productDetails/{id}")
    private ResponseEntity<ProductDetailsPageDTO> getProductDetails(@PathVariable Integer id, Pageable pageable) {
        return ResponseEntity.ok().body(pageService.getProductDetails(id,pageable));
    }
    // TODO реализовать
    @GetMapping("/public/homePage")
    private ResponseEntity<List<ProductGroupDTO>> getHomePage(HttpServletRequest request,
                                                              Pageable pageable, @RequestBody RecommendationFilterDTO recommendationFilterDTO){
        return ResponseEntity.ok().body(pageService.getHomePage(customerService
                .getCustomerIdFromRequest(request),pageable,recommendationFilterDTO));
    }
    // TODO реализовать
    @PostMapping("/public/categoryPage/{categoryId}")
    public ResponseEntity<ProductGroupDTO> getCategoryPage(
            @PathVariable Integer categoryId,
            @RequestBody CharacteristicFilterDTO characteristicFilterDTO) {

        // Извлекаем значения характеристик из DTO
        List<CharacteristicValueDTO> selectedValues = characteristicFilterDTO.getValues();

        ProductGroupDTO result = pageService.getCategoryPage(categoryId, selectedValues);
        return ResponseEntity.ok(result);
    }

    // TODO реализовать
    @GetMapping("/customer/wishlistPage")
    private ResponseEntity<ProductGroupDTO> getWishlistPage(HttpServletRequest request){
        return ResponseEntity.ok().body(pageService.getWishlistPage(customerService.getCustomerIdFromRequest(request)));
    }
    // TODO реализовать
    @GetMapping("/public/fastSearch/{query}")
    private ResponseEntity<List<ProductCardDTO>> getFastSearchResult(@PathVariable String query, Pageable pageable){
        return ResponseEntity.ok().body(pageService.getFastSearchResult(query,pageable));
    }

    @GetMapping("/public/searchResult/{query}")
    private ResponseEntity<ProductGroupDTO> getSearchResultPage(@PathVariable String query, Pageable pageable){
        return ResponseEntity.ok().body(pageService.getSearchResultPage(query, pageable));
    }

    @GetMapping("/public/categoryTitles")
    private ResponseEntity<List<CategoryDTO>> getCategoryTitles(){
        return ResponseEntity.ok().body(pageService.getCategoryTitles());
    }

    @GetMapping("/public/homePageCategoryDetails/{criteria}")
    private ResponseEntity<ProductGroupDTO> getHomePageCategoryDetails(@PathVariable String criteria,
                                                                       HttpServletRequest request,
                                                                       Pageable pageable, @RequestBody RecommendationFilterDTO recommendationFilterDTO){
        return  ResponseEntity.ok().body(pageService.getHomePageCategoryDetails(criteria,
                customerService.getCustomerIdFromRequest(request),pageable,recommendationFilterDTO));
    }

    @GetMapping("/public/getSortCharacteristics/{categoryId}")
    private ResponseEntity<List<CharacteristicFilterDTO>> getSortCharacteristics(@PathVariable Integer categoryId){
        return ResponseEntity.ok().body(pageService.getCategoryCharacteristic(categoryId));
    }

}

