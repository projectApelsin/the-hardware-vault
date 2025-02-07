import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import PaymentComponent from "../../Payment/PaymentComponent";


const ModalOrder = ({ isOpen, onClose, purchaseProductsId, price, quantity }) => {
  const [formData, setFormData] = useState({
    city: "",
    postalOffice: "",
    deliveryMethod: "nova_poshta", // Значение по умолчанию
  });

  const [isPaymentTriggered, setPaymentTriggered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (method) => {
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const handleSubmit = () => {
    if (!formData.city || !formData.postalOffice) {
      alert("Будь ласка, заповніть всі поля форми.");
      return;
    }
    setPaymentTriggered(true);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {!isPaymentTriggered ? (
        <div className="bg-smalt-50 p-8 flex flex-col  rounded-xs h-[55vh] w-[25vw] gap-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold font-montserrat text-xl">Оформлення замовлення</h2>
            <img
            src="/icons/close-icon.svg"
            alt="Закрыть"
            className="cursor-pointer w-5 h-5"
            onClick={onClose}
          />
          </div>

          <div className="flex flex-col gap-5 ">
            <div className="flex flex-col gap-5 ">
              <div className="modal__content-body-input-frame">
                <label className="modal__content-body-input-frame-title">
                  Місто:
                </label>
                <input
                  type="text"
                  name="city"
                  className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Введіть ваше місто"
                />
              </div>

              <div className="modal__content-body-input-frame">
                <label className="modal__content-body-input-frame-title">
                  Номер поштового відділення:
                </label>
                <input
                  type="text"
                  name="postalOffice"
                  className="h-8 w-full rounded-md border-solid border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
                  value={formData.postalOffice}
                  onChange={handleInputChange}
                  placeholder="Введіть номер відділення"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 ">
              <label className="flex gap-2 ">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={formData.deliveryMethod === "nova_poshta"}
                  onChange={() => handleDeliveryChange("nova_poshta")}
                  className="cursor-pointer"
                />
                <span className="modal__content-body-input-checkbox-text">
                  Нова Пошта
                </span>
              </label>
              <label className="flex gap-2 ">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={formData.deliveryMethod === "ukr_poshta"}
                  onChange={() => handleDeliveryChange("ukr_poshta")}
                  className="cursor-pointer"
                />
                <span className="modal__content-body-input-checkbox-text">
                  Укр Пошта
                </span>
              </label>
            </div>
          </div>

         
          <div className="flex flex-col justify-center gap-5 mt-5 ">
          <button
            className="bg-smalt-500 h-10 hover:bg-smalt-600 duration-200 hover:text-white active:bg-smalt-800 active:text-white rounded-md cursor-pointer"
            onClick={handleSubmit}
          >
            Підтвердити замовлення
          </button>


  
        </div>
        </div>
      ) : (
        <PaymentComponent
          purchaseProductsId={purchaseProductsId}
          price={price}
          quantity={quantity}
          formData={formData}
          onOperationComplete={(type, title, message) => {
            alert(`${title}: ${message}`);
            onClose();
          }}
        />
      )}
    </ModalWrapper>
  );
};

ModalOrder.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  purchaseProductsId: PropTypes.arrayOf(PropTypes.number).isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default ModalOrder;
