import axios from 'axios';

const ApiConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-production-e7c9.up.railway.app',
    withCredentials: true, // Включаем куки
});

// Добавляем интерсептор для проверки истечения токена
ApiConfig.interceptors.response.use(
    (response) => {
        console.log("Успішний запит:", response.config.url, response.data);
        return response;
    },
    async (error) => {
        console.error("Помилка запиту:", error.response?.status, error.message);
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest.__isRetry) {
            originalRequest.__isRetry = true;
            console.log("Починаємо оновлення токена...");

            try {
                const refreshResponse = await axios.post(
                    'https://backend-production-e7c9.up.railway.app/api/auth/refresh',
                    {},
                    { withCredentials: true }
                );

                console.log("Токен оновлено:", refreshResponse.data);

                return ApiConfig(originalRequest); // Повторний запит
            } catch (refreshError) {
                console.error("Помилка при оновленні токена:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
console.log("Используемый baseURL:", import.meta.env.VITE_API_BASE_URL);
export default ApiConfig;
