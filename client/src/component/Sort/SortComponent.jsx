import React, { useState } from "react";
import "./SortComponent.scss";

const SortComponent = ({ sortCriteria, setSortCriteria }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sort">
      <div className="sort__button" onClick={() => setIsOpen(!isOpen)}>
        <p className="sort__text">{sortCriteria ? `Сортувати за: ${sortCriteria}` : "Сортувати за"}</p>
      </div>
      {isOpen && (
        <div className="sort__content">
          {["Цiною (по возрастанию)", "Цiною (по убыванию)", "Назвою"].map((option) => (
            <div
              key={option}
              className="sort__option"
              onClick={() => {
                setSortCriteria(option);
                setIsOpen(false);
              }}
            >
              <p className="sort__text">{option}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortComponent;
