import React, { useEffect, useState } from "react";
import { getHomePage } from "../config/ApiPage";
import ProductGroup from "../component/ProductGroup/ProductGroup";
import CategoryComponent from "../component/Category/CategoryComponent";

const HomePage = () => {
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Управляемые состояния для запроса
  const [budget, setBudget] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestBody = {
          budget,
          categoryId,
        };

        const data = await getHomePage(requestBody);
        setHomeData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Ошибка при загрузке домашней страницы:", err);
        setError("Не удалось загрузить данные домашней страницы.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budget, categoryId]); // Запуск запроса при изменении budget или categoryId

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Передаём setBudget и setCategoryId в CategoryComponent */}
      <CategoryComponent setBudget={setBudget} setCategoryId={setCategoryId} />

      {/* Отображение групп продуктов */}
      {Array.isArray(homeData) &&
        homeData.map((group, index) => <ProductGroup key={index} productGroup={group} />)}
    </div>
  );
};

export default HomePage;
