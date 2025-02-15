import ApiConfig from './ApiConfig';
export async function getCategoryPage(categoryId, filters = null) {
  try {
    const response = await ApiConfig.post(
      `/api/public/categoryPage/${categoryId}`,
      // Передаем данные в нужном формате
      Object.keys(filters).map(characteristicName => ({
        characteristicName, // Имя характеристики
        values: filters[characteristicName].map(valueId => ({
          valueId, // ID выбранного значения
          valueTitle: "" // Укажите необходимое значение для title
        }))
      }))
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении страницы категории:', error.response?.data || error.message);
    throw error;
  }
}



// Получить домашнюю страницу с пагинацией и фильтрами
export async function getHomePage({
  page = 0,
  size = 4,
  categoryId = null,
  budget = null
} = {}) {
  // Приводим к null, если данные отсутствуют или не выбраны
  const requestBody = {
    categoryId: categoryId || null,
    budget: budget || null
  };

  const response = await ApiConfig.post('/api/public/homePage', requestBody, {
    params: { page, size }
  });
  
  return response.data;
}

export async function getSearchResultPage(query, page = 0, filters = null) {
  // Формируем тело запроса с фильтрами в нужном формате
  const filtersData = Object.keys(filters || {}).map(characteristicName => ({
    characteristicName, // Имя характеристики
    values: filters[characteristicName].map(valueId => ({
      valueId, // ID выбранного значения
      valueTitle: "" // Указываем пустое значение для title
    }))
  }));

  // Выполняем POST запрос, передавая только фильтры и параметры страницы
  const response = await ApiConfig.post(`/api/public/searchResult/${query}`, filtersData, {
    params: { page }, // Параметры страницы передаются как query parameters
  });

  return response.data;
}



export async function getSearchSortCharacteristics(query, page = 0) {
  const response = await ApiConfig.get(`/api/public/getSortSearchCharacteristics/${query}`,
    { params: { page} });
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
  try{
  const response = await ApiConfig.get(`/api/public/productDetails/${productId}`);
  return response.data;
}
  catch (error) {
    console.error('Ошибка при получении деталей категории:', error.response?.data || error.message);
    throw error;
  }
}

// Получить характеристики для сортировки по категории
export async function getSortCharacteristics(categoryId) {
  try{
  const response = await ApiConfig.get(`/api/public/getSortCharacteristics/${categoryId}`);
  return response.data;
  }
  catch (error) {
    console.error('Ошибка при получении деталей категории:', error.response?.data || error.message);
    throw error;
  }
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