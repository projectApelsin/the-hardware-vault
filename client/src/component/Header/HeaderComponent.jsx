import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderComponent.scss";
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

  return (
    <>
      <div className="header">
        <div className="header__container">
          {/* Логотип */}
          <div className="header__logo">
            <img
              src="/icons/logo-first.svg"
              alt="Логотип первая часть"
              className="header__logo-first-icon"
            />
            <img
              src="/icons/logo-second.svg"
              alt="Логотип вторая часть"
              className="header__logo-second-icon"
            />
          </div>

          {/* Группа иконок и поиск */}
          <div className="header__icons-group">
            {/* Поле поиска */}
            <SearchComponent />

            {/* Линейная группа иконок */}
            <div className="header__icons-group__linear">
              <img
                src="/icons/heart-empty.svg"
                alt="Иконка избранного"
                className="header__icons-group__linear-icon"
                onClick={handleWishlistClick}
              />
              <img
                src="/icons/shopping-cart-black.svg"
                alt="Иконка корзины"
                className="header__icons-group__linear-icon"
                onClick={handleCartClick}
              />
              <img
                src="/icons/User.svg"
                alt="Иконка профиля"
                className="header__icons-group__linear-icon"
                onClick={handleProfileClick}
              />
            </div>
          </div>
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
