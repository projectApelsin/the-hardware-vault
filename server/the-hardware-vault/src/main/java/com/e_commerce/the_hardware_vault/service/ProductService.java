package com.e_commerce.the_hardware_vault.service;

import com.e_commerce.the_hardware_vault.api.DTO.ReviewDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductCardDTO;
import com.e_commerce.the_hardware_vault.api.DTO.product.ProductGroupDTO;
import com.e_commerce.the_hardware_vault.api.Enum.GroupType;
import com.e_commerce.the_hardware_vault.model.Product;
import com.e_commerce.the_hardware_vault.model.Review;
import com.e_commerce.the_hardware_vault.model.repository.CustomerRepository;
import com.e_commerce.the_hardware_vault.model.repository.ProductRepository;
import com.e_commerce.the_hardware_vault.model.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;

    public ProductService(ProductRepository productRepository,
                          ReviewRepository reviewRepository, CustomerRepository customerRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
    }

    public static ProductGroupDTO toProductGroupDTO(List<Product> products, String groupTitle, Integer id, GroupType groupType) {
        // Преобразуем список продуктов в список ProductCardDTO
        List<ProductCardDTO> productCardDTOs = products.stream()
                .map(ProductService::toProductCardDTO) // Преобразование каждого Product в ProductCardDTO
                .collect(Collectors.toList());

        // Создаем ProductGroupDTO
        ProductGroupDTO productGroupDTO = new ProductGroupDTO();
        productGroupDTO.setId(id); // Устанавливаем id
        productGroupDTO.setTitle(groupTitle); // Устанавливаем заголовок
        productGroupDTO.setProductCards(productCardDTOs); // Устанавливаем список продуктов
        productGroupDTO.setGroupType(groupType); // Устанавливаем GroupType

        return productGroupDTO;
    }


    public static ProductGroupDTO toProductGroupDTO(List<Product> products, String groupTitle, Integer id) {
        return toProductGroupDTO(products, groupTitle, id, null); // По умолчанию GroupType = null
    }


    public static ProductCardDTO toProductCardDTO(Product product) {
        ProductCardDTO dto = new ProductCardDTO();
        dto.setId(product.getId());
        dto.setImage(product.getCardImage());
        dto.setTitle(product.getTitle());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(calculateDiscountPrice(product.getPrice(), product.getDiscountPercent()));

        dto.setRating(product.getAverageRating());
        return dto;
    }

    public static Integer calculateDiscountPrice(Integer price, BigDecimal discountPercent) {
        if (price == null || discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        // Рассчитываем итоговую цену с учётом скидки
        BigDecimal priceDecimal = BigDecimal.valueOf(price);
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(discountPercent.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        BigDecimal discountedPrice = priceDecimal.multiply(discountMultiplier).setScale(0, RoundingMode.HALF_UP);

        return discountedPrice.intValue(); // Приводим результат к Integer
    }


    public List<ReviewDTO> getReviewsByProduct(Integer productId) {
        List<ReviewDTO> reviewDTOList = new ArrayList<>();
        reviewRepository.findAllByProductId(productId).forEach(review -> {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setReviewText(review.getReviewText());
            reviewDTO.setRating(review.getRating());
            reviewDTO.setFirstName(review.getCustomer().getFirstName());
            reviewDTO.setReviewDate(review.getCreatedAt());
            reviewDTOList.add(reviewDTO);
        });
        return reviewDTOList;
    }

    public ResponseEntity<String> addReviewForProduct(Integer productId, ReviewDTO reviewDTO, Integer customerId) {
        try {
            // Проверяем, есть ли отзыв от данного пользователя для этого продукта
            boolean reviewExists = reviewRepository.existsByProductIdAndCustomerId(productId, customerId);

            if (reviewExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Відгук вже існує");
            }

            // Создаем новый отзыв
            Review review = new Review();
            review.setReviewText(reviewDTO.getReviewText());
            review.setRating(reviewDTO.getRating());
            review.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            review.setCustomer(customerRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Користувача не знайдено")));
            review.setProduct(productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Продукт не знайдено")));
            reviewRepository.save(review);

            return ResponseEntity.status(HttpStatus.CREATED).body("Відгук створено");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Помилка: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Сталася несподівана помилка");
        }

    }
}
