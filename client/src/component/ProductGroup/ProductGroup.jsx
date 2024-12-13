import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductGroup.scss";

const ProductGroup = ({ productGroup }) => {
  if (!productGroup) {
    console.warn("Проп productGroup не передан в компонент ProductGroup");
    return null;
  }

  const { title, productCards, groupType, id } = productGroup;
  const navigate = useNavigate();

  const handleNavigate = () => {
    switch (groupType) {
      case "SUBCATEGORY":
        navigate(`/subcategory/${id}`);
        break;
      case "RECOMMENDATION":
        navigate("/homePageCategoryDetails/recommended");
        break;
      case "DISCOUNT":
        navigate("/homePageCategoryDetails/discount");
        break;
      case "BESTSELLER":
        navigate("/homePageCategoryDetails/bestSeller");
        break;
      default:
        console.warn("Неизвестный тип группы: ", groupType);
    }
  };

  return (
    <section className="productGroup">
      <div className="productGroup__header">
        <div className="productGroup__header-container">
          <p className="productGroup__header-title">{title}</p>
          <a className="productGroup__header-link" onClick={handleNavigate}>
            <p className="productGroup__header-link-text">Перейти</p>
            <img src="/icons/category-icon.svg" alt="category link icon" />
          </a>
        </div>
        <div className="productGroup__items">
          <div className="productGroup__items-container">
            {productCards.map((product, index) => (
              <div
                className="productGroup__items-card category__item"
                key={product.id || index} // Используем product.id, если его нет - индекс
              >
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
      </div>
    </section>
  );
};

export default ProductGroup;
