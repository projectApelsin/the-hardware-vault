import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SortComponent from "../Sort/SortComponent";
import "./ProductList.scss";

const ProductList = ({ productGroup }) => {
  const { title, productCards = [] } = productGroup; // Значение по умолчанию для productCards

  const [sortedProducts, setSortedProducts] = useState([]);

  // Устанавливаем начальные продукты для рендера
  useEffect(() => {
    setSortedProducts(productCards);
  }, [productCards]);

  const handleSorted = (sorted) => {
    setSortedProducts(sorted || []); // Обновляем массив с отсортированными продуктами
  };

  return (
    <section className="list">
      <div className="list__header">
        <div className="list__header-container">
          <p className="list__header-title">{title}</p>
          <SortComponent products={sortedProducts} onSorted={handleSorted} />
        </div>
      </div>
      <div className="list__items">
        <div className="list__items-container">
          {Array.isArray(sortedProducts) &&
            sortedProducts.map((product) => (
              <div className="list__items-card" key={product.id}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  rating={product.rating}
                  image={product.image}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
