import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard"; // Путь к компоненту ProductCard
import SortComponent from "../sort/SortComponent";
import "./ProductList.scss";

const ProductList = ({ productGroup }) => {
  const { title, productCards } = productGroup;

  const [sortedProducts, setSortedProducts] = useState(productCards);

  const handleSorted = (sorted) => {
    setSortedProducts(sorted); // Обновляем состояние отсортированных продуктов
  };

  return (
    <section className="list">
      <div className="list__header">
        <div className="list__header-container">
          <p className="list__header-title">{title}</p>
          <SortComponent products={productCards} onSorted={handleSorted} />
        </div>
      </div>
      <div className="list__items">
        <div className="list__items-container">
          {sortedProducts.map((product) => (
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
