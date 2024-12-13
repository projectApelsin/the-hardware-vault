import ApiConfig from './ApiConfig';


/// Получить страницу категории с фильтрацией и пагинацией
export async function getCategoryPage(categoryId, page = 0, size = 12, filters = null) {
  try {
    const response = await ApiConfig.post(
      `/api/public/categoryPage/${categoryId}`,
      { values: filters }, // Передаём фильтры в теле
      { params: { page, size } } // Параметры пагинации
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении страницы категории:', error.response?.data || error.message);
    throw error;
  }
}

// Получить домашнюю страницу с пагинацией
export async function getHomePage(page = 0, size = 4) {
  const response = await ApiConfig.get('/api/public/homePage', {
    params: { page, size },
  });
  return response.data;
}

// Поиск по ключевому слову
export async function getSearchResult(query, page = 0, size = 4,) {
  const response = await ApiConfig.get(`/api/public/searchResult/${query}`,
    { params: { page, size } }
  );
  return response.data;
}

// Быстрый поиск
export async function fastSearch(query) {
  const response = await ApiConfig.get(`/api/public/fastSearch/${query}`);
  return response.data;
}

// Получить заголовки категорий
export async function getCategoryTitles() {
  const response = await ApiConfig.get('/api/public/categoryTitles');
  return response.data;
}

// Получить детали продукта
export async function getProductDetails(productId) {
  const response = await ApiConfig.get(`/api/public/productDetails/${productId}`);
  return response.data;
}

// Получить характеристики для сортировки по категории
export async function getSortCharacteristics(categoryId) {
  const response = await ApiConfig.get(`/api/public/getSortCharacteristics/${categoryId}`);
  return response.data;
}

export async function getHomePageCategoryDetails(type, page = 0, size = 12) {
  try {
    const response = await ApiConfig.get(`/api/public/homePageCategoryDetails/${type}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении деталей категории:', error.response?.data || error.message);
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

export async function fetchProductDetails(productId, pageable = { page: 0, size: 4 }) {
  try {
    const response = await ApiConfig.get(`/api/public/productDetails/${productId}`, {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке деталей продукта:", error.response?.data || error.message);
    throw error;
  }
}