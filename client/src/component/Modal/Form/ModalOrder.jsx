import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "./ModalWrapper"; // Используем ранее созданный ModalWrapper
import PaymentComponent from "../../Payment/PaymentComponent";
import "./ModalForm.scss";

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
        <div className="modal__content">
          <div className="modal__content-header">
            <h2 className="modal__content-header-text">Оформлення замовлення</h2>
            <button className="modal__close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal__content-body">
            <div className="modal__content-body-input">
              <div className="modal__content-body-input-frame">
                <label className="modal__content-body-input-frame-title">
                  Місто:
                </label>
                <input
                  type="text"
                  name="city"
                  className="modal__content-body-input-frame-line-area"
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
                  className="modal__content-body-input-frame-line-area"
                  value={formData.postalOffice}
                  onChange={handleInputChange}
                  placeholder="Введіть номер відділення"
                />
              </div>
            </div>

            <div className="modal__content-body-input-checkbox">
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={formData.deliveryMethod === "nova_poshta"}
                  onChange={() => handleDeliveryChange("nova_poshta")}
                />
                <span className="modal__content-body-input-checkbox-text">
                  Нова Пошта
                </span>
              </label>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={formData.deliveryMethod === "ukr_poshta"}
                  onChange={() => handleDeliveryChange("ukr_poshta")}
                />
                <span className="modal__content-body-input-checkbox-text">
                  Укр Пошта
                </span>
              </label>
            </div>
          </div>

          <div className="modal__content-body-confirm">
            <div
              className="modal__content-body-confirm-button"
              onClick={handleSubmit}
            >
              <p className="modal__content-body-confirm-button-text">Підтвердити замовлення</p>
            </div>
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
