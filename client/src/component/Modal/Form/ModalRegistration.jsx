import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import { register } from "../../../config/ApiAuth"; // Импорт функции логина


const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      setErrorMessage(error.response?.data?.message || "Помилка при реєстрація");
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-smalt-50 p-7 flex flex-col  gap-5 rounded-xs h-[85vh] w-[20vw]">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <p className="font-semibold font-montserrat text-xl">Реєстрація</p>
          <img
            src="/icons/close-icon.svg"
            alt="Закрыть"
            className="cursor-pointer w-5 h-5"
            onClick={onClose}
          />
        </div>

        {/* Тело модального окна */}
        <div className="flex flex-col gap-2">


          {/* Поле Email */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Email</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
            </div>
          </div>

          {/* Поле Имя */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Имя</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ваше ім'я"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
            </div>
          </div>

          {/* Поле Фамилия */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Прізвище</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ваше прізвище"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
            </div>
          </div>

          {/* Поле Телефон */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Телефон</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+380"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
            </div>
          </div>

          {/* Поле Пароль */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Пароль</p>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть ваш пароль"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
              <img
                src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                alt="Показать пароль"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-4 h-4"
              />
            </div>
          </div>

          {/* Поле Подтверждение Пароля */}
          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Підтвердження пароля</p>
            <div className="modal__content-body-input-frame-line">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Підтвердіть ваш пароль"
                className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
              />
            </div>
          </div>
          
          {errorMessage && <p className="text-red-500 flex items-center">{errorMessage}</p>}
          </div>
          {/* Кнопка регистрации */}
          <div className="">
            <div className="flex flex-col justify-center gap-5 mt-5 ">
              <button
                className="bg-smalt-500 h-10 w-60 hover:bg-smalt-600 duration-200 hover:text-white active:bg-smalt-800 active:text-white rounded-md cursor-pointer"
                onClick={handleRegister}
              >
                Зарегистрироваться

              </button>
            </div>
          </div>
        
      </div>
    </ModalWrapper>
  );
};

export default RegisterModal;
