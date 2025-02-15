import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";


const ProductGroup = ({ productGroup, productId }) => {
  if (!productGroup) {
    console.warn("Проп productGroup не передан в компонент ProductGroup");
    return null;
  }
  const navigate = useNavigate();
  const { title, productCards, groupType, id } = productGroup;
  
  const handleNavigate = () => {
    console.log("Тип группы:", groupType); // Проверяем, что передаётся
    
    if (!groupType) {
      console.warn("Ошибка: groupType отсутствует в productGroup", productGroup);
      return;
    }
    let path = "";
    switch (groupType) {
      case "SIMILAR":
        path = "/homePageCategoryDetails/similar";
        break;
      case "RECOMMENDATION":
        path = "/homePageCategoryDetails/recommended";
        break;
      case "DISCOUNT":
        path = "/homePageCategoryDetails/discount";
        break;
      case "BESTSELLER":
        path = "/homePageCategoryDetails/bestSeller";
        break;
      default:
        console.warn("Неизвестный тип группы: ", groupType);
        return;
    }
  
    // Передаём productId в состояние
    navigate(path, { state: { productId } });
  };
  

  return (
    <section className="flex flex-col mb-10">
      <div className="flex-col flex  mt-20">
        <div className="flex-row flex justify-between mr-25 ml-25 items-center">
          <p className="text-3xl font-montserrat font-semibold">{title}</p>
          <a className="flex flex-row gap-1 items-center cursor-pointer" onClick={handleNavigate}>
            <p className="text-cm font-montserrat font-medium">Перейти</p>
            <img src="/icons/category-icon.svg" alt="category link icon" className="w-4 h-4"/>
          </a>
        </div>
        
          <div className="flex flex-row gap-10 justify-center mt-15 ">
            {productCards.map((product, index) => (
              <div
                className=""
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
    </section>
  );
};

export default ProductGroup;
