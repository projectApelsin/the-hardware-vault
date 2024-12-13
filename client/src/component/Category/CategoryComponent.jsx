import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryTitles } from "../../config/ApiPage"; // Импорт функции получения категорий
import "./CategoryComponent.scss"; // Подключаем ваши стили

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryTitles();
        setCategories(response);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
  };

  return (
    <div className="category__container">
      {/* Список категорий */}
      <div className="category__category-content">
        <div className="category__category-content-frame">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category__category-content-frame-group"
              onClick={() => handleCategoryClick(category.id)}
            >
              <p className="category__category-content-frame-group-title">
                {category.title}
              </p>
              <div className="category__category-content-frame-group-icon">
                <img
                  src="/icons/category-icon.svg"
                  alt="Arrow"
                  className="category__category-content-frame-group-icon-size"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Баннер */}
      <div className="category__banner-group">
        <div className="category__banner-group-frame">
          <img
            src="/images/banner-example.jpg" // Здесь укажите путь к вашему баннеру
            alt="Banner"
            className="category__banner-group-frame-size"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
