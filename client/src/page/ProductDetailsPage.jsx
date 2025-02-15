import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../config/ApiPage";
import ProductTop from "../component/ProductDetails/ProductTopComponent/ProductTopComponent";
import ProductInfo from "../component/ProductDetails/ProductDescriptionComponent/ProductDescriptionComponent";
import ReviewsComponent from "../component/ProductDetails/ProductReviewsComponent/ProductReviewsComponent";
import ProductGroup from "../component/ProductGroup/ProductGroup";
import ProductAdditionComponent from "../component/ProductDetails/ProductAdditionComponent";

const ProductDetailsPage = () => {
  const { productId } = useParams(); // Получение ID продукта из пути
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchProductDetails(productId);
        setProductDetails(data);
      } catch (err) {
        console.error("Ошибка при загрузке деталей продукта:", err);
        setError("Не удалось загрузить данные о продукте.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const {
    title,
    shortDescription,
    price,
    discountPrice,
    image,
    countReviews,
    rating,
    otherImage,
    description,
    characteristics,
    productGroup,
  } = productDetails;

  return (
    <div>
      {/* Верхний блок с изображением и основной информацией */}
      <ProductTop
        productName={title}
        productDescription={shortDescription}
        productPrice={price}
        discountPrice={discountPrice}
        productImage={image}
        productReviews={countReviews}
        productRating={rating}
        productOtherImages={otherImage}
        productId ={productId}
      />

      {/* Блок информации о продукте */}
      <ProductAdditionComponent
        description={description} 
        characteristics={characteristics}
        title={title}
        price={price} 
        discountPrice={discountPrice}
        image={image}
        productId={productId}
          />

      {/* Блок отзывов */}
     
      {/* Блок похожих продуктов */}
      {productGroup && productGroup.productCards.length > 0 && (
        <ProductGroup
          productGroup={{
            id: productGroup.id,
            title: productGroup.title,
            productCards: productGroup.productCards.slice(0, 4), // Ограничение до 4 продуктов
            groupType: productGroup.groupType,
          }}
          productId={productId}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
