import React,{useState} from 'react'

const ProductBuyCard = ({ image, title, price, discountPrice, }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      const response = await addToShoppingCart(productId, quantity);
      console.log("Добавлено в корзину:", response);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  return (
    <div className='flex flex-col gap-10 items-center bg-smalt-100 pb-10 pt-10 rounded-2xl'>
      <div className='flex flex-row gap-5 '>
        <img className="w-[120px] h-[120px] " src={"/images/" + image} alt={title} />
        <div className='flex flex-col gap-2 '>
          <div className='font-montserrat font-semibold text-2xl'>{title}</div>
          <div className="font-montserrat font-bold text-3xl">
            {discountPrice ? (
              <>
                <div className='flex flex-row gap-5 items-center'>
                  <span className="font-montserrat font-semibold text-2xl text-smalt-900">{discountPrice} ₴</span>
                  <span className="font-montserrat font-medium text-gray-400 text-[17px] line-through">{price} ₴</span>
                </div>
              </>
            ) : (
              <span className="font-montserrat font-bold text-2xl">{productPrice} ₴</span>
            )}
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
        </div>

      </div>
      <button className="p-3 bg-smalt-500 w-[80%] font-medium  text-white rounded-xl cursor-pointer hover:bg-smalt-600 duration-300 active:bg-smalt-700 hover:text-white font-montserrat" onClick={handleAddToCart}>
        В корзину
      </button>
    </div>
  )
}

export default ProductBuyCard