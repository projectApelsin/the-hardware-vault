import React, { useState, useEffect } from "react";
import { getProductsFromShoppingCart, deleteFromShoppingCart, changeProductQuantity, addToShoppingCart } from "../../../config/ApiCustomer";
import ModalWrapper from "../Form/ModalWrapper";

import ModalOrder from '../Form/ModalOrder';

const CartItem = ({ id, image, title, capacity, price, amount, onRemove, onChangeQuantity }) => (
  <div className="flex flex-row w-full gap-5 ">
    
      <img className=" w-[100px] h-[100px]" src={"/images/" + image} alt={title} />

      <div className="flex flex-col w-full mr-5">
        <p className="">{title}</p>

        <div className="flex flex-row justify-between mt-3">
          <div className="flex flex-row gap-2">
            <svg
              className="hover:stroke-gray-500 duration-300"
              width="3.3vh"
              height="3.2vh"
              viewBox="0 0 33 32"
              fill="none"
              stroke="#0E0F0E"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => onChangeQuantity(id, -1)}
            >
              <path
                d="M20.5 16H12.5M28.5 16C28.5 22.6274 23.1274 28 16.5 28C9.87258 28 4.5 22.6274 4.5 16C4.5 9.37258 9.87258 4 16.5 4C23.1274 4 28.5 9.37258 28.5 16Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="">{amount}</span>
            <svg
              className="hover:stroke-gray-500 duration-300"
              width="3.3vh"
              height="3.2vh"
              viewBox="0 0 33 32"
              fill="none"
              stroke="#0E0F0E"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => onChangeQuantity(id, 1)}
            >
              <path
                d="M16.5 12V16M16.5 16V20M16.5 16H20.5M16.5 16H12.5M28.5 16C28.5 22.6274 23.1274 28 16.5 28C9.87258 28 4.5 22.6274 4.5 16C4.5 9.37258 9.87258 4 16.5 4C23.1274 4 28.5 9.37258 28.5 16Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="">{price ? `${price} ₴` : "Ціна не вказана"}</div>
          <svg
            className="hover:fill-red-500 duration-300 w-5 h-5"
            width="2.6vh"
            height="2.6vh"
            viewBox="0 0 26 26"
            fill="#0E0F0E"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => onRemove(id)}
          >
            <path
              d="M7.5835 22.75C6.98766 22.75 6.47777 22.538 6.05383 22.1141C5.62988 21.6901 5.41755 21.1799 5.41683 20.5833V6.5H4.3335V4.33333H9.75016V3.25H16.2502V4.33333H21.6668V6.5H20.5835V20.5833C20.5835 21.1792 20.3715 21.6894 19.9476 22.1141C19.5236 22.5388 19.0134 22.7507 18.4168 22.75H7.5835ZM18.4168 6.5H7.5835V20.5833H18.4168V6.5ZM9.75016 18.4167H11.9168V8.66667H9.75016V18.4167ZM14.0835 18.4167H16.2502V8.66667H14.0835V18.4167Z"
            />
          </svg>
        </div>
      </div>
    
  </div>
);

const Cart = ({ items, totalAmount, onRemoveItem, onChangeQuantity, onOrder }) => (

  <section className="bg-smalt-100 p-7 rounded-md flex flex-col gap-5" >
    <div className="flex flex-row justify-between">
      <p className="font-bold font-montserrat text-xl">Корзина</p>

    </div>
    <div className="flex flex-row">
      <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar w-120 h-120">
        {items.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            capacity={item.capacity}
            price={item.price}
            amount={item.amount}
            onRemove={onRemoveItem}
            onChangeQuantity={onChangeQuantity}
          />
        ))}
      </div>
      <div className="bg-smalt-50 h-30 flex flex-col gap-5 rounded-lg p-4">
        <div className="flex flex-row gap-5">
          <p className="font-medium font-montserrat">Загальна сума:</p>
          <p className="font-normal font-montserrat">{totalAmount} ₴</p>
        </div>
        <button className=" font-montserrat bg-smalt-500 h-10 hover:bg-smalt-600 duration-200 hover:text-white active:bg-smalt-800 active:text-white rounded-md cursor-pointer" onClick={onOrder}>
          Оформити замовлення
        </button>
      </div>
    </div>
  </section>

);

const CartModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await getProductsFromShoppingCart();
      setItems(response);
    } catch (err) {
      console.error("Ошибка при загрузке корзины:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCartItems();
  }, [isOpen]);

  const handleRemoveItem = async (id) => {
    // Сохраняем старый список, чтобы откатить в случае ошибки
    const prevItems = items;
  
    // Локально удаляем товар
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  
    try {
      await deleteFromShoppingCart(id); // Запрос на бэк
    } catch (err) {
      console.error("Ошибка при удалении товара из корзины:", err.message);
      setItems(prevItems); // Откат, если запрос не удался
    }
  };

  const handleChangeQuantity = async (id, change) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, amount: Math.max(1, item.amount + change) } // Ограничение
          : item
      )
    );
  
    try {
      await changeProductQuantity(id, change);
    } catch (err) {
      console.error("Ошибка при изменении количества товара:", err.message);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, amount: Math.max(1, item.amount - change) } // Откат с учетом ограничения
            : item
        )
      );
    }
  };
  
  
  const handleOrder = () => {
    setOrderModalOpen(true);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.amount, 0);

  return (
    <>
      <ModalWrapper isOpen={isOpen} onClose={onClose}>
        {loading ? (
          <div>Загрузка корзины...</div>
        ) : (
          <Cart
            items={items}
            totalAmount={totalAmount}
            onRemoveItem={handleRemoveItem}
            onChangeQuantity={handleChangeQuantity}
            onOrder={handleOrder}
          />
        )}
      </ModalWrapper>

      {isOrderModalOpen && (
        <ModalOrder
          isOpen={isOrderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          purchaseProductsId={items.map((item) => item.id)}
          price={totalAmount}
          quantity={items.reduce((sum, item) => sum + item.amount, 0)}
        />
      )}
    </>
  );
};

export default CartModal;
