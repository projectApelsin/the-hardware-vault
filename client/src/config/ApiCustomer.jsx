import ApiConfig from './ApiConfig';



// Добавить продукт в вишлист
export async function addToWishlist(productId) {
  try {
    const response = await ApiConfig.post(`/api/customer/addToWishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении в вишлист:', error.response?.data || error.message);
    throw error;
  }
}

// Проверить, находится ли продукт в вишлисте
export async function isInWishlist(productId) {
  try {
    const response = await ApiConfig.get(`/api/customer/isInWishlist/${productId}`);
    return response.data; // Возвращаем результат проверки
  } catch (error) {
    console.error('Ошибка при проверке продукта в вишлисте:', error.response?.data || error.message);
    throw error; // Пробрасываем ошибку для обработки
  }
}


// Получить вишлист
export async function getWishlistPage() {
  try {
    const response = await ApiConfig.get('/api/customer/wishlistPage');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении вишлиста:', error.response?.data || error.message);
    throw error;
  }
}

// Удалить продукт из вишлиста
export async function deleteFromWishlist(productId) {
  try {
    const response = await ApiConfig.delete(`/api/customer/deleteFromWishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении из вишлиста:', error.response?.data || error.message);
    throw error;
  }
}

// Добавить продукт в корзину
export async function addToShoppingCart(productId) {
  try {
    const response = await ApiConfig.post(`/api/customer/addToShoppingCart/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error.response?.data || error.message);
    throw error;
  }
}

// Получить продукты из корзины
export async function getProductsFromShoppingCart() {
  try {
    const response = await ApiConfig.get('/api/customer/getProductsFromShoppingCart');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении продуктов из корзины:', error.response?.data || error.message);
    throw error;
  }
}

// Удалить продукт из корзины
export async function deleteFromShoppingCart(productId) {
  try {
    const response = await ApiConfig.delete(`/api/customer/deleteFromShoppingCart/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении из корзины:', error.response?.data || error.message);
    throw error;
  }
}

// Изменить количество продукта в корзине
export async function changeProductQuantity(productId, quantity) {
  try {
    const response = await ApiConfig.put(`/api/customer/changeProductQuantity/${productId}/${quantity}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при изменении количества продукта:', error.response?.data || error.message);
    throw error;
  }
}

// Добавить отзыв на продукт
export async function addReview(productId, reviewData) {
  try {
    const response = await ApiConfig.post(`/api/customer/addReview/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении отзыва:', error.response?.data || error.message);
    throw error;
  }
}


// Получить отзывы для продукта
export async function getReviews(productId) {
  try {
    const response = await ApiConfig.get(`/api/public/getReviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error.response?.data || error.message);
    throw error;
  }
}