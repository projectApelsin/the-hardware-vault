package com.e_commerce.the_hardware_vault.service;

import com.e_commerce.the_hardware_vault.api.DTO.CategoryDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.CharacteristicFilterDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.CharacteristicValueDTO;
import com.e_commerce.the_hardware_vault.api.DTO.filter.RecommendationFilterDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.CharacteristicDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductCardDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductDetailsPageDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductGroupDTO;
import com.e_commerce.the_hardware_vault.api.Enum.GroupType;
import com.e_commerce.the_hardware_vault.model.Category;
import com.e_commerce.the_hardware_vault.model.CharacteristicValue;
import com.e_commerce.the_hardware_vault.model.Customer;
import com.e_commerce.the_hardware_vault.model.Product;
import com.e_commerce.the_hardware_vault.model.repository.CategoryRepository;
import com.e_commerce.the_hardware_vault.model.repository.CustomerRepository;
import com.e_commerce.the_hardware_vault.model.repository.ProductRepository;
import com.e_commerce.the_hardware_vault.model.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class PageService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final CustomerRepository customerRepository;

    private final CategoryRepository categoryRepository;


    public PageService(ProductRepository productRepository, ReviewRepository reviewRepository, ProductService productService, CustomerRepository customerRepository,

                       CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.customerRepository = customerRepository;

        this.categoryRepository = categoryRepository;
    }

    public ProductDetailsPageDTO getProductDetails(Integer productId) {
        Product product = productRepository.findById(productId).get();
        ProductDetailsPageDTO productDetailsPageDTO = new ProductDetailsPageDTO();

        productDetailsPageDTO.setTitle(product.getTitle());
        productDetailsPageDTO.setDescription(product.getDescription());
        productDetailsPageDTO.setPrice(product.getPrice());
        productDetailsPageDTO.setShortDescription(product.getShortDescription());
        productDetailsPageDTO.setRating(product.getAverageRating());
        productDetailsPageDTO.setImage(product.getMainImage());
        productDetailsPageDTO.setOtherImage(product.getOtherPictureUrl());
        List<CharacteristicDTO> characteristics = new ArrayList<>();
        product.getCharacteristicValues().forEach(characteristic -> {
            CharacteristicDTO characteristicDTO = new CharacteristicDTO();
            characteristicDTO.setValue(characteristic.getTitle());
            characteristicDTO.setTitle(characteristic.getCharacteristic().getTitle());
            characteristics.add(characteristicDTO);
        });
        productDetailsPageDTO.setCharacteristics(characteristics);

        productDetailsPageDTO.setCountReviews(reviewRepository.findCountReviewsByProductId(productId));

        productDetailsPageDTO.setProductGroup(ProductService.toProductGroupDTO(productRepository
                        .findSimilarProductsById(productId, PageRequest.of(0, 4)),
                "Схожі ігри", null));

        return productDetailsPageDTO;
    }


    public List<ProductGroupDTO> getHomePage(Integer customerId, Pageable pageable,
                                             RecommendationFilterDTO recommendationFilterDTO) {
        List<ProductGroupDTO> productGroupDTOList = new ArrayList<>();

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findPopularProducts(pageable).toList(),
                "Бестселлери", null, GroupType.BESTSELLER
        ));

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findDiscountedProducts(pageable).toList(),
                "Акції", null, GroupType.DISCOUNT
        ));
        if (customerId == null) {
            productGroupDTOList.add(ProductService.toProductGroupDTO(
                    getRecommendedProducts(customerId, recommendationFilterDTO.getCategoryId(),
                            recommendationFilterDTO.getBudget(), pageable).toList(),
                    "Рекомендовані товари", null, GroupType.RECOMMENDATION
            ));
        }

        return productGroupDTOList;
    }

    public Page<Product> getRecommendedProducts(Integer customerId, Integer categoryId, Integer budget, Pageable pageable) {
        // Если не задан ни бюджет, ни категория:
        if (budget == null && categoryId == null) {
            return productRepository.findAll(pageable);
        }

        if (budget == null && categoryId != null) {
            // Категория задана, но бюджет нет - вернуть товары из категории
            return productRepository.findByCategoryId(categoryId, pageable);
        }

        if (budget != null && categoryId == null) {
            // Бюджет задан, но категория нет - вернуть товары по бюджету
            return productRepository.findProductsByBudget(budget, pageable);
        }

        // Если и категория, и бюджет заданы, продолжаем логику с рекомендациями
        List<Integer> topCharacteristics = productRepository.findTopCharacteristicByCustomerAndCategory(customerId, categoryId);
        if (customerId == null || topCharacteristics.isEmpty()) {
            return productRepository.findProductsByCategoryAndBudget(categoryId, budget, pageable);
        }

        Integer topCharId = topCharacteristics.get(0);
        return productRepository.findRecommendedByCharacteristic(categoryId, budget, topCharId, pageable);
    }


    public ProductGroupDTO getHomePageCategoryDetails(String criteria, Integer customerId,
                                                      Pageable pageable, RecommendationFilterDTO recommendationFilterDTO) {
        switch (criteria) {
            case "recommended":
                return ProductService.toProductGroupDTO(getRecommendedProducts(customerId,
                        recommendationFilterDTO.getCategoryId(), recommendationFilterDTO.getBudget(),
                        pageable).toList(), "Товари для вас", null);
            case "discount":
                return ProductService.toProductGroupDTO(
                        productRepository.findDiscountedProducts(pageable).toList(),
                        "Акції", null
                );
            case "bestSeller":
                return ProductService.toProductGroupDTO(
                        productRepository.findPopularProducts(pageable).toList(),
                        "Бестселлери", null
                );
            default:
                throw new IllegalArgumentException("Invalid criteria: " + criteria);
        }
    }


    // TODO реализовать
    // TODO реализовать
    public ProductGroupDTO getCategoryPage(Integer categoryId, List<CharacteristicValueDTO> selectedCharacteristicValueIds) {
        // Получаем категорию из репозитория
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Получаем все продукты категории
        List<Product> products = category.getProducts();

        // Если фильтры выбраны, применяем их
        if (selectedCharacteristicValueIds != null && !selectedCharacteristicValueIds.isEmpty()) {
            products = filterProductsByCharacteristics(products, selectedCharacteristicValueIds);
        }


        return ProductService.toProductGroupDTO(products, category.getTitle(), categoryId);
    }
    private List<Product> filterProductsByCharacteristics(List<Product> products, List<CharacteristicValueDTO> selectedCharacteristicValueDTOs) {
        // Извлекаем список ID значений характеристик из DTO
        Set<Integer> selectedCharacteristicValueIds = selectedCharacteristicValueDTOs.stream()
                .map(CharacteristicValueDTO::getValueId) // Извлекаем valueId из DTO
                .collect(Collectors.toSet());

        return products.stream()
                .filter(product -> {
                    // Получаем ID всех характеристик продукта
                    Set<Integer> productCharacteristicValueIds = product.getCharacteristicValues()
                            .stream()
                            .map(CharacteristicValue::getId) // Извлекаем ID характеристик продукта
                            .collect(Collectors.toSet());

                    // Проверяем, содержит ли продукт все выбранные значения
                    return productCharacteristicValueIds.containsAll(selectedCharacteristicValueIds);
                })
                .collect(Collectors.toList());
    }


    public ProductGroupDTO getWishlistPage(Integer customerId) {
        Customer customer = customerRepository.findById(customerId).get();
        Collection<Integer> productIdList = customer.getWishlist();
        List<Product> productList = new ArrayList<>();
        productIdList.forEach(productId -> {
            productList.add(productRepository.findById(productId).get());
        });
        return ProductService.toProductGroupDTO(productList, "Список ваших бажань", customerId);
    }


    public ProductGroupDTO getSearchResultPage(String query) {
        return ProductService.toProductGroupDTO(productRepository.findAllByTitleLike(query),
                "Результати Вашого пошуку", null);
    }
    public List<CharacteristicFilterDTO> getCategoryCharacteristic(Integer categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        List<CharacteristicFilterDTO> characteristicFilterDTOList = new ArrayList<>();

        category.getCharacteristics().forEach(characteristic -> {
            CharacteristicFilterDTO characteristicFilterDTO = new CharacteristicFilterDTO();
            characteristicFilterDTO.setCharacteristicName(characteristic.getTitle());

            List<CharacteristicValueDTO> valueDTOList = characteristic.getCharacteristicValues().stream()
                    .map(characteristicValue -> {
                        CharacteristicValueDTO characteristicValueDTO = new CharacteristicValueDTO();
                        characteristicValueDTO.setValueId(characteristicValue.getId());
                        characteristicValueDTO.setValueTitle(characteristicValue.getTitle());
                        return characteristicValueDTO;
                    })
                    .collect(Collectors.toList());

            characteristicFilterDTO.setValues(valueDTOList);
            characteristicFilterDTOList.add(characteristicFilterDTO);
        });

        return characteristicFilterDTOList;
    }

    public List<ProductCardDTO> getFastSearchResult(String query) {
        List<ProductCardDTO> productCardDTOList = new ArrayList<>();
        productRepository.findAllByTitleLike(query).forEach(product -> {
            productCardDTOList.add(ProductService.toProductCardDTO(product));
        });
        return productCardDTOList;
    }

    public List<CategoryDTO> getCategoryTitles() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOList = new ArrayList<>();
        categories.forEach(category -> {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setId(category.getId());
            categoryDTO.setTitle(category.getTitle());
            categoryDTOList.add(categoryDTO);
        });
        return categoryDTOList;
    }


    //TODO
}

