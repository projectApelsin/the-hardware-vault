import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import { register } from "../../../config/ApiAuth"; // Импорт функции логина

const InputField = ({ label, type, value, setValue, placeholder }) => (
  <div className="flex flex-col gap-2">
    <p className="text-gray-500 font-montserrat">{label}</p>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-md border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
    />
  </div>
);

const PasswordField = ({ label, value, setValue, showPassword, setShowPassword }) => (
  <div className="flex flex-col gap-2">
    <p className="text-gray-500 font-montserrat">{label}</p>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите ваш пароль"
        className="h-10 w-full rounded-md border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pr-10 pl-4"
      />
      <img
        src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
        alt="Показать пароль"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
      />
    </div>
  </div>
);



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
      <div className="bg-smalt-50 p-7 flex flex-col gap-5 rounded-xs w-[80vw] max-w-[350px]  min-h-[60vh] md:min-h-[75vh] lg:min-h-[85vh] justify-between">
        {/* Заголовок */}
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <p className="font-semibold font-montserrat text-xl">Реєстрація</p>
            <img
              src="/icons/close-icon.svg"
              alt="Закрыть"
              className="cursor-pointer w-5 h-5"
              onClick={onClose}
            />
          </div>

          {/* Поля ввода */}
          <div className="flex flex-col gap-3">
            <InputField label="Email" type="email" value={email} setValue={setEmail} placeholder="example@gmail.com" />
            <InputField label="Имя" type="text" value={firstName} setValue={setFirstName} placeholder="Ваше ім'я" />
            <InputField label="Прізвище" type="text" value={lastName} setValue={setLastName} placeholder="Ваше прізвище" />
            <InputField label="Телефон" type="tel" value={phoneNumber} setValue={setPhoneNumber} placeholder="+380" />

            {/* Пароль и подтверждение */}
            <PasswordField label="Пароль" value={password} setValue={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
            <InputField label="Підтвердження пароля" type="password" value={confirmPassword} setValue={setConfirmPassword} placeholder="Підтвердіть ваш пароль" />

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
        {/* Кнопка регистрации */}
        <div className="flex flex-col justify-center gap-5 mt-5">
          <button className="bg-smalt-500 h-10 w-full hover:bg-smalt-600 duration-200 hover:text-white active:bg-smalt-800 active:text-white rounded-md cursor-pointer" onClick={handleRegister}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </ModalWrapper>

  );
};

export default RegisterModal;
