import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SortComponent from "../sort/SortComponent";


const ProductList = ({ productGroup }) => {
  const { title, productCards = [] } = productGroup;

  const [sortCriteria, setSortCriteria] = useState(null);

 
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
  }, [sortCriteria, productCards]);

  return (
    <section className="flex-col flex">
      <div className="mt-15 mb-15">
        <div className="flex-row flex justify-between mr-25 ml-25 items-center">
          <p className="text-3xl font-montserrat font-semibold">{title}</p>
          <SortComponent sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
        </div>
      </div>
      <div className=" flex justify-center mb-10">
        <div className="grid grid-cols-4 gap-7 ">
          {sortedProducts.map((product) => (
            <div className="" key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
