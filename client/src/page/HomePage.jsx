import React, { useEffect, useState } from "react";
import { getHomePage } from "../config/ApiPage";
import ProductGroup from "../component/ProductGroup/ProductGroup";
import CategoryComponent from "../component/Category/CategoryComponent";

const HomePage = () => {
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = 0;
  const size = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomePage(page, size);
        // Если data — это сразу массив групп, то просто используем его:
        setHomeData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Ошибка при загрузке домашней страницы:", err);
        setError("Не удалось загрузить данные домашней страницы.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Компонент категорий */}
      <CategoryComponent />

      {/* Отображение групп продуктов */}
      {Array.isArray(homeData) && homeData.map((group, index) => (
        <ProductGroup key={index} productGroup={group} />
      ))}
    </div>
  );
};

export default HomePage;
