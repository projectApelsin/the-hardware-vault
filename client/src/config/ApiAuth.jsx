
import ApiConfig from './ApiConfig';

// Запрос на логин
export async function login({ email, password }) {
  try {
    const response = await ApiConfig.post('/api/auth/login', { email, password });
    return response.data; // Возвращаем данные, если запрос успешен
  } catch (error) {
    console.error('Ошибка при логине:', error.response?.data || error.message);
    throw error;
  }
}

// Запрос на регистрацию
export async function register({ email, firstName, lastName, password, confirmPassword, phoneNumber }) {
  try {
    const response = await ApiConfig.post('/api/auth/register', {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      phoneNumber,
    });
    return response.data; 
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response?.data || error.message);
    throw error; 
  }
}
