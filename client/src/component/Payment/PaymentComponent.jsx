import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createOrder } from "../../config/ApiPurchaseOrder";

const PaymentComponent = ({ purchaseProductsId, price, quantity, formData, onOperationComplete }) => {
  const isPaymentHandled = useRef(false); // Контрольный флаг

  useEffect(() => {
    const handlePayment = async () => {
      if (isPaymentHandled.current) return; // Проверяем, если уже выполнено, пропускаем
      isPaymentHandled.current = true;

      const orderData = {
        purchaseProductsId,
        price,
        city: formData.city,
        deliveryMethod: formData.deliveryMethod,
        postalOffice: formData.postalOffice,
      };

      try {
        const response = await createOrder(orderData);
        const { data, signature } = response;

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.liqpay.ua/api/3/checkout";
        form.target = "_blank";

        const dataInput = document.createElement("input");
        dataInput.type = "hidden";
        dataInput.name = "data";
        dataInput.value = data;

        const signatureInput = document.createElement("input");
        signatureInput.type = "hidden";
        signatureInput.name = "signature";
        signatureInput.value = signature;

        form.appendChild(dataInput);
        form.appendChild(signatureInput);
        document.body.appendChild(form);

        form.submit();
        onOperationComplete("success", "Успіх!", "Ваше замовлення створено.");
      } catch (error) {
        console.error("Помилка створення замовлення:", error.message);
        onOperationComplete("error", "Помилка!", "Не вдалося створити замовлення.");
      }
    };

    handlePayment();
  }, [purchaseProductsId, price, quantity, formData, onOperationComplete]); // Зависимости для предотвращения лишних вызовов

  return null;
};

PaymentComponent.propTypes = {
  purchaseProductsId: PropTypes.arrayOf(PropTypes.number).isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  onOperationComplete: PropTypes.func.isRequired,
};

export default PaymentComponent;
