import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import { login } from "../../../config/ApiAuth"; // Импорт функции логина
import "./ModalForm.scss";

const ModalLogin = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      console.log("Успешный логин:", response);
      onClose(); // Закрываем модальное окно после успешного логина
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Ошибка при логине");
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="modal__content">
        <div className="modal__content-header">
          <p className="modal__content-header-text">Вход</p>
          <img
            src="/icons/close-icon.svg"
            alt="Закрыть"
            className="modal__content-header-icon"
            onClick={onClose}
          />
        </div>

        <div className="modal__content-body">
          {errorMessage && <p className="modal__content-error">{errorMessage}</p>}

          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              className="modal__content-body-input-frame-line-area"
            />
          </div>

          <div className="modal__content-body-input-frame">
            <p className="modal__content-body-input-frame-title">Пароль</p>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
              className="modal__content-body-input-frame-line-area"
            />
            <img
              src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
              alt="Показать пароль"
              onClick={() => setShowPassword(!showPassword)}
              className="modal__content-body-input-frame-line-icon"
            />
          </div>

          <div className="modal__content-body-confirm">
            <button
              className="modal__content-body-confirm-button"
              onClick={handleLogin}
            >
              Войти
            </button>
          </div>

          <p className="modal__content-body-confirm-or-text">или</p>
          <div
            className="modal__content-body-confirm-link"
            onClick={onSwitchToRegister}
          >
            <p className="modal__content-body-confirm-link-text">Зарегистрироваться</p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ModalLogin;
