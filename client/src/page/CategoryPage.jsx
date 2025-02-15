import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterCharacteristic from "../component/Filter/FilterCharacterisctic";
import { getCategoryPage } from "../config/ApiPage";
import ProductCard from "../component/ProductCard/ProductCard"; // Предполагается, что у вас есть компонент для отображения карточек

const CategoryPage = () => {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryPage = async () => {
      try {
        // Передаем фильтры в запрос
        const data = await getCategoryPage(categoryId, filters);
        
        setProducts(data.productCards || []);
        setTitle(data.title);
      } catch (error) {
        console.error("Ошибка загрузки категории:", error);
        console.error(categoryId);
      }
    };

    fetchCategoryPage();
  }, [categoryId, filters]); // Обновляем товары при изменении `categoryId` или `filters`

  const handleFilterChange = (selectedFilters) => {
    setFilters(selectedFilters);
    // Отправляем запрос с фильтрами
    getCategoryPage(categoryId, selectedFilters).then(data => {
      console.log(data);
      console.log(selectedFilters);
    });
  };

  return (
    <div className="flex flex-row mt-20 mb-20 ">
      <div className="flex flex-col ml-30 gap-10">
      <div className="font-montserrat font-bold text-3xl">{title}</div>
        <FilterCharacteristic categoryId={categoryId} onFilterChange={handleFilterChange} />
        
      </div>
      <div className="ml-25 flex flex-wrap gap-6">
        {products.map((product) => (
          <div key={product.id} >
            <div className="" key={product.id}>
              <ProductCard {...product} /> {/* Отправляем каждый продукт в компонент ProductCard */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
