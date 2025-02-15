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
import com.e_commerce.the_hardware_vault.model.*;
import com.e_commerce.the_hardware_vault.model.repository.*;
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
    private final CharacteristicRepository characteristicRepository;

    public PageService(ProductRepository productRepository, ReviewRepository reviewRepository, ProductService productService, CustomerRepository customerRepository,

                       CategoryRepository categoryRepository, CharacteristicRepository characteristicRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.customerRepository = customerRepository;

        this.categoryRepository = categoryRepository;
        this.characteristicRepository = characteristicRepository;
    }

    public ProductDetailsPageDTO getProductDetails(Integer productId, Pageable pageable) {
        Product product = productRepository.findById(productId).get();
        ProductDetailsPageDTO productDetailsPageDTO = new ProductDetailsPageDTO();

        productDetailsPageDTO.setTitle(product.getTitle());
        productDetailsPageDTO.setDescription(product.getDescription());
        productDetailsPageDTO.setPrice(product.getPrice());
        productDetailsPageDTO.setShortDescription(product.getShortDescription());
        productDetailsPageDTO.setRating(product.getAverageRating());
        productDetailsPageDTO.setImage(product.getMainImage());
        productDetailsPageDTO.setOtherImage(product.getOtherPictureUrl());
        productDetailsPageDTO.setDiscountPrice(productService.calculateDiscountPrice(product.getPrice(),product.getDiscountPercent()));
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
                        .findSimilarProductsById(productId, pageable).toList(),
                "Схожі ігри", null, GroupType.SIMILAR));

        return productDetailsPageDTO;
    }


    public List<ProductGroupDTO> getHomePage(Integer customerId, Pageable pageable,
                                             RecommendationFilterDTO recommendationFilterDTO) {
        List<ProductGroupDTO> productGroupDTOList = new ArrayList<>();

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                getRecommendedProducts(customerId, recommendationFilterDTO.getCategoryId(),
                        recommendationFilterDTO.getBudget(), pageable).toList(),
                "Рекомендовані товари", null, GroupType.RECOMMENDATION
        ));

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findPopularProducts(pageable).toList(),
                "Бестселлери", null, GroupType.BESTSELLER
        ));

        productGroupDTOList.add(ProductService.toProductGroupDTO(
                productRepository.findDiscountedProducts(pageable).toList(),
                "Акції", null, GroupType.DISCOUNT
        ));



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
            case "similar":
                return ProductService.toProductGroupDTO(productRepository.findSimilarProductsById(recommendationFilterDTO.getProductId(),
                        pageable).toList(), "Схожі товари", null);
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

    public ProductGroupDTO getCategoryPage(Integer categoryId, List<CharacteristicFilterDTO> characteristicFilterDTOList) {
        // Получаем категорию из репозитория
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Собираем ID выбранных характеристик
        List<Integer> selectedCharacteristicValueIds = characteristicFilterDTOList.stream()
                .flatMap(characteristicFilterDTO -> characteristicFilterDTO.getValues().stream()) // Получаем все значения характеристик
                .map(CharacteristicValueDTO::getValueId) // Извлекаем ID значений характеристик
                .collect(Collectors.toList());

        // Получаем все продукты категории
        List<Product> products = category.getProducts();

        // Если выбраны фильтры, фильтруем товары
        if (!selectedCharacteristicValueIds.isEmpty()) {
            products = filterProductsByCharacteristics(products, selectedCharacteristicValueIds);
        }

        return ProductService.toProductGroupDTO(products, category.getTitle(), categoryId);
    }

    private List<Product> filterProductsByCharacteristics(List<Product> products, List<Integer> selectedCharacteristicValueIds) {
        Set<Integer> selectedIdsSet = new HashSet<>(selectedCharacteristicValueIds);

        return products.stream()
                .filter(product -> product.getCharacteristicValues().stream()
                        .map(CharacteristicValue::getId)
                        .anyMatch(selectedIdsSet::contains)) // Проверяем, есть ли хотя бы одно совпадение
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


    public ProductGroupDTO getSearchResultPage(String query, List<CharacteristicFilterDTO> characteristicFilterDTOList,Pageable pageable) {
        List<Product> products = productRepository.findAllByTitleLike(query, pageable).toList();

        List<Integer> selectedCharacteristicValueIds = characteristicFilterDTOList.stream()
                .flatMap(characteristicFilterDTO -> characteristicFilterDTO.getValues().stream()) // Получаем все значения характеристик
                .map(CharacteristicValueDTO::getValueId) // Извлекаем ID значений характеристик
                .collect(Collectors.toList());

        if (!selectedCharacteristicValueIds.isEmpty()) {
            products = filterProductsByCharacteristics(products, selectedCharacteristicValueIds);
        }
        return ProductService.toProductGroupDTO(products,"Результат Вашого пошуку:", null, null);
    }

    public List<CharacteristicFilterDTO> getCategoryCharacteristic(Integer categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        List<CharacteristicFilterDTO> characteristicFilterDTOList = new ArrayList<>();

        category.getCharacteristics().forEach(characteristic -> {
            CharacteristicFilterDTO characteristicFilterDTO = new CharacteristicFilterDTO();
            characteristicFilterDTO.setCharacteristicId(characteristic.getId());
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

    public List<CharacteristicFilterDTO> getSearchCharacteristic(String query, Pageable pageable) {
        List<CharacteristicFilterDTO> characteristicFilterDTOList = new ArrayList<>();
        Map<Integer, Integer> characteristicCountMap = new HashMap<>(); // Для подсчета частоты характеристик

        // Ищем все продукты по запросу
        productRepository.findAllByTitleLike(query, pageable).forEach(product -> {
            // Перебираем все характеристики для каждого продукта
            product.getCharacteristicValues().forEach(characteristicValue -> {
                // Если характеристика уже добавлена в список, увеличиваем её счётчик
                characteristicCountMap.put(characteristicValue.getCharacteristic().getId(), characteristicCountMap.getOrDefault(characteristicValue.getId(), 0) + 1);
            });
        });

        // Создаем список характеристик из мапы, сортируя по частоте появления
        characteristicCountMap.entrySet().stream()
                .sorted((entry1, entry2) -> Integer.compare(entry2.getValue(), entry1.getValue())) // Сортируем по убыванию частоты
                .forEach(entry -> {
                    // Найдем характеристику по её ID и добавим в список
                    Characteristic characteristic = characteristicRepository.findById(entry.getKey())
                            .orElseThrow(() -> new RuntimeException("Характеристика не найдена"));

                    // Преобразуем характеристику в DTO
                    CharacteristicFilterDTO dto = new CharacteristicFilterDTO();
                    dto.setCharacteristicId(characteristic.getId());
                    dto.setCharacteristicName(characteristic.getTitle());

                    // Преобразуем значения характеристик в DTO
                    List<CharacteristicValueDTO> characteristicValues = characteristic.getCharacteristicValues().stream()
                            .map(value -> {
                                CharacteristicValueDTO valueDTO = new CharacteristicValueDTO();
                                valueDTO.setValueId(value.getId());
                                valueDTO.setValueTitle(value.getTitle());
                                return valueDTO;
                            })
                            .collect(Collectors.toList());

                    dto.setValues(characteristicValues);
                    characteristicFilterDTOList.add(dto);
                });

        return characteristicFilterDTOList;
    }


    public List<ProductCardDTO> getFastSearchResult(String query, Pageable pageable) {
        List<ProductCardDTO> productCardDTOList = new ArrayList<>();
        productRepository.findAllByTitleLike(query, pageable).forEach(product -> {
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

