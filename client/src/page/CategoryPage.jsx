import React, { useState } from "react";


const CategoryPage = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (selectedFilters) => {
    console.log("Selected filters:", selectedFilters);
    setFilters(selectedFilters);
  };

  return (
    <div>
      
      {/* Тут ваш компонент для пример бражения продуктов  тестируем*/}
    </div>
  );
};

export default CategoryPage;