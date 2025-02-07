import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SortComponent from "../sort/SortComponent";
import "./ProductList.scss";

const ProductList = ({ productGroup }) => {
  const { title, productCards = [] } = productGroup;

  const [sortCriteria, setSortCriteria] = useState(null);

  // ✅ Используем useMemo, чтобы избежать повторных ререндеров
  const sortedProducts = useMemo(() => {
    if (!sortCriteria) return productCards;
    
    let sorted = [...productCards];

    if (sortCriteria === "Цiною (по возрастанию)") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === "Цiною (по убыванию)") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === "Назвою") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [sortCriteria, productCards]); // ✅ Отсортированные продукты обновляются только при изменении `sortCriteria` или `productCards`

  return (
    <section className="list">
      <div className="list__header">
        <div className="list__header-container">
          <p className="list__header-title">{title}</p>
          <SortComponent sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
        </div>
      </div>
      <div className="list__items">
        <div className="list__items-container">
          {sortedProducts.map((product) => (
            <div className="list__items-card" key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
