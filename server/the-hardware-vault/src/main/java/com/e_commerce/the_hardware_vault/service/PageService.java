package com.e_commerce.the_hardware_vault.service;

import com.e_commerce.the_hardware_vault.api.DTO.CategoryDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.CharacteristicDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductCardDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductDetailsPageDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductGroupDTO;
import com.e_commerce.the_hardware_vault.api.Enum.GroupType;
import com.e_commerce.the_hardware_vault.model.Category;
import com.e_commerce.the_hardware_vault.model.Characteristic;
import com.e_commerce.the_hardware_vault.model.Customer;
import com.e_commerce.the_hardware_vault.model.Product;
import com.e_commerce.the_hardware_vault.model.repository.CategoryRepository;
import com.e_commerce.the_hardware_vault.model.repository.CustomerRepository;
import com.e_commerce.the_hardware_vault.model.repository.ProductRepository;
import com.e_commerce.the_hardware_vault.model.repository.ReviewRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class PageService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final CustomerRepository customerRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;


    public PageService(ProductRepository productRepository, ReviewRepository reviewRepository, ProductService productService, CustomerRepository customerRepository,
                       SubcategoryRepository subcategoryRepository,
                       CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.customerRepository = customerRepository;
        this.subcategoryRepository = subcategoryRepository;
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


    public List<ProductGroupDTO> getHomePage(Integer customerId) {
        List<ProductGroupDTO> productGroupDTOList = new ArrayList<>();

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findPopularProducts(),
                "Бестселлери", null, GroupType.BESTSELLER
        ));

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findDiscountedProducts(),
                "Акції", null, GroupType.DISCOUNT
        ));

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findRecommendedProducts(customerId),
                "Рекомендовані товари", null, GroupType.RECOMMENDATION
        ));

        return productGroupDTOList;
    }


    public ProductGroupDTO getHomePageCategoryDetails(String criteria, Integer customerId) {
        switch (criteria) {
            case "recommended":
                return ProductService.toProductGroupDTO(productRepository
                        .findRecommendedProducts(customerId), "Рекомендовані товари", null);
            case "discount":
                return ProductService.toProductGroupDTO(productRepository
                        .findDiscountedProducts(), "Акції", null);
            case "bestSeller":
                return ProductService.toProductGroupDTO(productRepository.findPopularProducts(),
                        "Бестселлери", null);

        }
        return null;
    }


    // TODO реализовать
    public ProductGroupDTO getCategoryPage(Integer categoryId) {
        Set<Subcategory> subcategories = categoryRepository.findById(categoryId).get().getSubcategories();

        ProductGroupDTO productGroupDTOList = new ProductGroupDTO();
        subcategories.forEach(subcategory -> {
            List<Product> filteredProducts = productRepository.findProductsBySubcategoryAndCategory(subcategory.getId(), categoryId);

            productGroupDTOList.add(ProductService.toProductGroupDTO(
                    filteredProducts, subcategory.getTitle(), subcategory.getId(), GroupType.SUBCATEGORY
            ));
        });
        return productGroupDTOList;
    }

    // TODO реализовать
    public ProductGroupDTO getSubcategoryPage(Integer subcategoryId) {
        Subcategory subcategory = subcategoryRepository.findById(subcategoryId).get();
        return ProductService.toProductGroupDTO(
                subcategory.getProducts(), subcategory.getTitle(), subcategoryId, GroupType.SUBCATEGORY
        );
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
}

