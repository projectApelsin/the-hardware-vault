import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryTitles } from "../../config/ApiPage"; // Импорт функции получения категорий


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
    <div className="flex flex-row mt-5 justify-center gap-20 mb-15">
      {/* Список категорий */}
      <div className="bg-gray-100 w-70 p-5">
        <div className="">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <p className="category__category-content-frame-group-title">
                {category.title}
              </p>
              <div className="category__category-content-frame-group-icon">
                <img
                  src="/icons/category-icon.svg"
                  alt="Arrow"
                  className="w-4 h-4"
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
            src="/images/banner.jpg" // Здесь укажите путь к вашему баннеру
            alt="Banner"
            className=" h-[600px] w-[1000px] "
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
