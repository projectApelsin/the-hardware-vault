import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./ModalForm.scss";

const ModalWrapper = ({ isOpen, onClose, children }) => {
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  // Закрытие модального окна при нажатии клавиши Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Логика определения нажатия и отпускания за пределами модального окна
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("modal__overlay")) {
      setIsOutsideClick(true);
    } else {
      setIsOutsideClick(false);
    }
  };

  const handleMouseUp = (e) => {
    if (isOutsideClick && e.target.classList.contains("modal__overlay")) {
      onClose();
    }
    setIsOutsideClick(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal__overlay"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="modal__content">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalWrapper;
