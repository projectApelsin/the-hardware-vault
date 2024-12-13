import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import { register } from "../../../config/ApiAuth"; // Импорт функции логина
import "./ModalForm.scss";

const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await register({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        phoneNumber,
      });
      console.log("Успешная регистрация:", response);
      onClose(); // Закрываем модальное окно после успешной регистрации
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Ошибка при регистрации");
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="modal__content">
        {/* Заголовок */}
        <div className="modal__content-header">
          <p className="modal__content-header-text">Регистрация</p>
          <img
            src="/icons/close-icon.svg"
            alt="Закрыть"
            className="modal__content-header-icon"
            onClick={onClose}
          />
        </div>

        {/* Тело модального окна */}
        <div className="modal__content-body">
          {errorMessage && <p className="modal__content-error">{errorMessage}</p>}

          {/* Поле Email */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Email</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Поле Имя */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Имя</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введите ваше имя"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Поле Фамилия */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Фамилия</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введите вашу фамилию"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Поле Телефон */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Телефон</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Введите ваш номер телефона"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Поле Пароль */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Пароль</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Поле Подтверждение Пароля */}
          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Подтвердите пароль</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Подтвердите ваш пароль"
                className="modal__content-body-input-frame-line-area"
              />
            </div>
          </div>

          {/* Кнопка регистрации */}
          <div className="modal__content-body-confirm">
            <button
              className="modal__content-body-confirm-button"
              onClick={handleRegister}
            >
              <p className="modal__content-body-confirm-button-text">Зарегистрироваться</p>
            </button>
          </div>

        </div>
      </div>
    </ModalWrapper>
  );
};

export default RegisterModal;
