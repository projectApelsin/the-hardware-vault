import React, { useState, useEffect } from "react";
import "./SortComponent.scss";

const SortComponent = ({ products, onSorted }) => {
  const [criteria, setCriteria] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Функция сортировки
  const sortProducts = (productsToSort, criteria) => {
    if (!criteria) return productsToSort;

    let sorted = [...productsToSort];
    if (criteria === "Цiною (по возрастанию)") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (criteria === "Цiною (по убыванию)") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (criteria === "Назвою") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  // Обновление отсортированных продуктов при изменении критерия
  useEffect(() => {
    const sorted = sortProducts(products, criteria);
    onSorted(sorted); // Передаем отсортированные продукты в родительский компонент
  }, [criteria, products]);

  return (
    <div className="sort">
      <div
        className="sort__button"
        onClick={() => setIsOpen(!isOpen)} // Переключаем открытие/закрытие списка
      >
        <p className="sort__text">{criteria ? `Сортувати за: ${criteria}` : "Сортувати за"}</p>
      </div>
      {isOpen && (
        <div className="sort__content">
          <div
            className="sort__option"
            onClick={() => {
              setCriteria("Цiною (по возрастанию)");
              setIsOpen(false);
            }}
          >
            <p className="sort__text">Цiною (по возрастанию)</p>
          </div>
          <div
            className="sort__option"
            onClick={() => {
              setCriteria("Цiною (по убыванию)");
              setIsOpen(false);
            }}
          >
            <p className="sort__text">Цiною (по убыванию)</p>
          </div>
          <div
            className="sort__option"
            onClick={() => {
              setCriteria("Назвою");
              setIsOpen(false);
            }}
          >
            <p className="sort__text">Назвою</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortComponent;
