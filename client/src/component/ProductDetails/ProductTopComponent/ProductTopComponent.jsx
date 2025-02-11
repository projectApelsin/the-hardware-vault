import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addToShoppingCart } from '../../../config/ApiCustomer';

const ProductTop = ({
  productName,
  productDescription,
  productPrice,
  discountPrice,
  productImage,
  productReviews,
  productRating,
  productOtherImages,
  productId,
}) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      const response = await addToShoppingCart(productId);
      console.log("Добавлено в корзину:", response);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  return (

    <div className="flex flex-col md:flex-row gap-8 mt-5 mb-10 mx-5 md:mx-20">
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <img className="w-full max-w-md md:max-w-lg h-auto" src={"/images/" + productImage} alt={productName} />
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {productOtherImages.map((img, index) => (
            <img key={index} className="w-16 h-16 md:w-20 md:h-20 object-cover" src={"/images/" + img} alt={`Preview ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 gap-5">
        <div className='flex flex-col gap-5'>
          <p className="font-montserrat font-bold text-4xl">{productName}</p>

          <div className="flex flex-row gap-2 mb-4">
            <ul className="flex flex-row gap-0.5">
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
        </div>
        <div className='flex flex-col gap-5'>
          <div className="font-montserrat font-bold text-3xl">
            {discountPrice ? (
              <>
                <div className='flex flex-row gap-5 items-center'>
                  <span className="font-montserrat font-bold text-3xl text-smalt-900">{discountPrice} ₴</span>
                  <span className="font-montserrat font-medium text-gray-300 text-[17px] line-through">{productPrice} ₴</span>
                </div>
              </>
            ) : (
              <span className="font-montserrat font-bold text-2xl">{productPrice} ₴</span>
            )}
          </div>

          <p className="font-montserrat mb-5 break-words">{productDescription}</p>
        </div>
        <div className="flex flex-row mb-5 gap-0.5">
          <svg
            onClick={decreaseQuantity}
            className="hover:stroke-gray-500 duration-300"
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
          <span className="flex items-center">{quantity}</span>
          <svg
            onClick={increaseQuantity}
            className="hover:stroke-gray-500 duration-300"
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
        <button className="p-3 bg-smalt-500 w-35 font-medium rounded-xl cursor-pointer hover:bg-smalt-600 duration-300 active:bg-smalt-700 text-white font-montserrat" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </div>


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
  productId: PropTypes.number.isRequired,
};

export default ProductTop;
