import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist, deleteFromWishlist, isInWishlist, addToShoppingCart } from '../../config/ApiCustomer';
import './ProductCard.scss';

const ProductCard = ({ id, title, price, discountPrice, rating = 0, image }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Ограничиваем значение rating от 0 до 5
  const validRating = Math.max(0, Math.min(5, rating));
  const fullStars = Array(validRating).fill("filled-star.svg");
  const emptyStars = Array(5 - validRating).fill("empty-star.svg");
  const allStars = [...fullStars, ...emptyStars];

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await isInWishlist(id);
        setIsFavorite(response); // Предполагаем, что API возвращает true/false
      } catch (error) {
        console.error("Ошибка при проверке вишлиста:", error);
      }
    };
    checkWishlistStatus();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      if (isFavorite) {
        await deleteFromWishlist(id);
        console.log("Удалено из вишлиста");
      } else {
        await addToWishlist(id);
        console.log("Добавлено в вишлист");
      }
      setIsFavorite(!isFavorite); // Переключаем статус
    } catch (error) {
      console.error("Ошибка при переключении статуса вишлиста:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await addToShoppingCart(id);
      console.log("Добавлено в корзину:", response);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  return (
    <div className="flex flex-col bg-smalt-50 gap-2 relative ">
      <div className="pt-14 pr-5 pl-5 pb-4 flex justify-center">
        <Link to={`/productDetails/${id}`}>
          <img src={"/images/" + image} alt={title} className="w-[228px]" />
        </Link>
        <img
          className="absolute top-[16px] right-[16px] cursor-pointer"
          src={isFavorite ? "/icons/heart-filled.svg" : "/icons/heart-empty.svg"}
          alt="Card like icon"
          onClick={handleWishlistToggle}
        />
      </div>

      <div className="flex flex-col gap-5 mr-7 ml-7 pb-3">
        <div className="flex ">
          <p className="font-montserrat font-medium text-lg">{title}</p>
        </div>
        <ul className="flex flex-row gap-1 justify">
          {allStars.map((star, index) => (
            <li key={index} className="">
              <img src={"/icons/" + star} alt="star icon" className="productCard__bottom-rating-group-icon" />
            </li>
          ))}
        </ul>
        <div className="productCard__bottom-payment">
          <div className="productCard__bottom-payment-prices">
            <p className="productCard__bottom-payment-prices-value">
              {discountPrice ? `${discountPrice} ₴` : `${price} ₴`}
            </p>
            {discountPrice && <p className="productCard__bottom-payment-prices-old">{price} ₴</p>}
          </div>
          <div className="productCard__bottom-payment-icon" onClick={handleAddToCart}>
            <img src="/icons/shopping-cart.svg" alt="Card cart icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
