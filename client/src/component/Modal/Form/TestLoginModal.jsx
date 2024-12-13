import React, { useState } from "react";
import LoginModal from "./ModalLogin";
import RegisterModal from './ModalRegistration';
import CartModal from "../Cart/ModalCart";
import OrderModal from "./ModalOrder";

const TestLoginModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={handleOpenModal}>Открыть модальное окно логина</button>
      <CartModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default TestLoginModal;