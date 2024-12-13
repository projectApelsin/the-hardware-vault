import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ProductTopComponent.scss';

const ProductTop = ({
  productName,
  productDescription,
  productPrice,
  discountPrice,
  productImage,
  productReviews,
  productRating,
  productOtherImages,
}) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <section className="product-top">
      <div className="product-top__container">
        <div className="product-top__container-left">
          
          <div className="product-top__slider-container">
            <div className="product-top__slider">
              
              <img className="product-top__slider-image" src={"/images/" +productImage} alt={productName} />
              
            </div>
            <div className="product-top__previews">
              {productOtherImages.map((img, index) => (
                <div key={index} className="product-top__previews-item">
                  <img className="product-top__previews-item-image" src={"/images/" + img} alt={`Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="product-top__info">
          <div className="product-top__info-container">
            <p className="product-top__info-title">{productName}</p>
            <p className="product-top__info-desc">{productDescription}</p>
            
            <div className="productCard__item-actions-prices">
              {discountPrice ? (
                <>
                  <span className="product-top__info-price-discount">{discountPrice} ₴</span>
                  <span className="productCard__item-actions-old">{productPrice} ₴</span>
                </>
              ) : (
                <span className="productCard__item-actions-value">{productPrice} ₴</span>
              )}
            </div>
            <div className="product-top__info-rating">
              <ul className="product-top__info-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="product-top__info-stars-item">
                    <img
                      src={index < productRating ? "/icons/filled-star.svg" : "/icons/empty-star.svg"}
                      alt={`Star ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
              <p className="product-top__info-reviews-amount">{productReviews} відгуків</p>
            </div>
            <div className="product-top__info-amount">
              <svg
                onClick={decreaseQuantity}
                className="product-top__info-amount-icon product-top__info-amount-icon--disabled"
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                stroke="#0E0F0E"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5 16H12.5M28.5 16C28.5 22.6274 23.1274 28 16.5 28C9.87258 28 4.5 22.6274 4.5 16C4.5 9.37258 9.87258 4 16.5 4C23.1274 4 28.5 9.37258 28.5 16Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="product-top__info-amount-value">{quantity}</span>
              <svg
                onClick={increaseQuantity}
                className="product-top__info-amount-icon"
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                stroke="#0E0F0E"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 12V16M16.5 16V20M16.5 16H20.5M16.5 16H12.5M28.5 16C28.5 22.6274 23.1274 28 16.5 28C9.87258 28 4.5 22.6274 4.5 16C4.5 9.37258 9.87258 4 16.5 4C23.1274 4 28.5 9.37258 28.5 16Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <button className="product-top__info-addcart" onClick={() => alert('Товар додано в корзину')}>
              В корзину
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

ProductTop.propTypes = {
  productName: PropTypes.string.isRequired,
  productDescription: PropTypes.string.isRequired,
  productPrice: PropTypes.number.isRequired,
  discountPrice: PropTypes.number,
  productImage: PropTypes.string.isRequired,
  productReviews: PropTypes.number.isRequired,
  productRating: PropTypes.number.isRequired,
  productOtherImages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductTop;
