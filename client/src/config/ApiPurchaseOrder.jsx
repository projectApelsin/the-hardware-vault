import ApiConfig from './ApiConfig';


export async function createOrder({ purchaseProductsId, price, city, deliveryMethod, postalOffice }) {
    try {
      const response = await ApiConfig.post('/api/customer/createOrder', {
        purchaseProductsId,
        price,
        city,
        deliveryMethod,
        postalOffice,
      });
      return response.data; // Возвращаем данные, если запрос успешен
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.response?.data || error.message);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  } 