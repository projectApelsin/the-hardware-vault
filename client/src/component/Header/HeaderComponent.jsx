import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchComponent from "./SearchComponent";
import ModalLogin from "../Modal/Form/ModalLogin"; // Импорт компонента модального окна для логина
import ModalRegister from "../Modal/Form/ModalRegistration"; // Импорт компонента модального окна для регистрации
import CartModal from "../Modal/Cart/ModalCart"; // Импорт компонента корзины

const HeaderComponent = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (modalType) => {
    if (modalType === "login") {
      setLoginModalOpen(true);
    } else if (modalType === "register") {
      setRegisterModalOpen(true);
    } else if (modalType === "cart") {
      setCartModalOpen(true);
    }
  };

  const closeModal = (modalType) => {
    if (modalType === "login") {
      setLoginModalOpen(false);
    } else if (modalType === "register") {
      setRegisterModalOpen(false);
    } else if (modalType === "cart") {
      setCartModalOpen(false);
    }
  };

  const handleProfileClick = () => openModal("login");
  const handleCartClick = () => openModal("cart");
  const handleWishlistClick = () => navigate("/wishlist");
  const handleLogoClick = () => navigate("/");

  return (
    <>
      
        <div className="flex flex-row w-full h-25 items-center justify-between pr-10 pl-20 bg-smalt-500">
          {/* Логотип */}
          <div className="flex flex-col cursor-pointer" onClick={handleLogoClick}>
            <img
              src="/icons/logo-first.svg"
              alt="Логотип первая часть"
              className="w-[133px] h-[17.5px] "
            />
            <img
              src="/icons/logo-second.svg"
              alt="Логотип вторая часть"
              className="w-[76px] h-[36px]"
            />
          </div>

          
            <SearchComponent />
          
            {/* Линейная группа иконок */}
            <div className="flex flex-row gap-10">
              <img
                src="/icons/heart-empty.svg"
                alt="Иконка избранного"
                className="cursor-pointer"
                onClick={handleWishlistClick}
              />
              <img
                src="/icons/shopping-cart-black.svg"
                alt="Иконка корзины"
                className="cursor-pointer"
                onClick={handleCartClick}
              />
              <img
                src="/icons/User.svg"
                alt="Иконка профиля"
                className="cursor-pointer"
                onClick={handleProfileClick}
              />
            </div>
          
        </div>
      

      {/* Модальное окно логина */}
      {isLoginModalOpen && (
        <ModalLogin
          isOpen={isLoginModalOpen}
          onClose={() => closeModal("login")}
          onSwitchToRegister={() => {
            closeModal("login");
            openModal("register");
          }}
        />
      )}

      {/* Модальное окно регистрации */}
      {isRegisterModalOpen && (
        <ModalRegister
          isOpen={isRegisterModalOpen}
          onClose={() => closeModal("register")}
          onSwitchToLogin={() => {
            closeModal("register");
            openModal("login");
          }}
        />
      )}

      {/* Модальное окно корзины */}
      {isCartModalOpen && (
        <CartModal isOpen={isCartModalOpen} onClose={() => closeModal("cart")} />
      )}
    </>
  );
};

export default HeaderComponent;
