import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import { login } from "../../../config/ApiAuth"; // Импорт функции логина


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
      <div className="bg-smalt-50 p-7 flex flex-col  rounded-xs h-[65vh] w-[20vw]">
        <div className="flex justify-between items-center">
          <p className="font-semibold font-montserrat text-xl ">Вход</p>
          <img
            src="/icons/close-icon.svg"
            alt="Закрыть"
            className="cursor-pointer w-5 h-5"
            onClick={onClose}
          />
        </div>

        <div className="flex gap-5 flex-col mt-10">


          <div className="flex gap-2 flex-col">
            <p className="text-gray-500 font-montserrat">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <p className="text-gray-500 font-montserrat">Пароль</p>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
                className="h-8 w-full rounded-md border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pr-10 pl-4"
              />
              <img
                src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                alt="Показать пароль"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-4 h-4"
              />
            </div>
          </div>
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        <div className="flex flex-col justify-center gap-5 mt-15 ">
          <button
            className="bg-smalt-500 h-10 hover:bg-smalt-600 duration-200 hover:text-white active:bg-smalt-800 active:text-white rounded-md cursor-pointer"
            onClick={handleLogin}
          >
            Войти
          </button>


          <p className="flex justify-center">или</p>
          <div
            className="flex justify-center text-smalt-900 cursor-pointer"
            onClick={onSwitchToRegister}
          >
            Зарегистрироваться
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ModalLogin;
