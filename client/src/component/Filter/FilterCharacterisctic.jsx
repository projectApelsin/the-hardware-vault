import React, { useState, useEffect } from "react";
import "./FilterCharacterisctic.scss"; // Подключение стилей
import { getSortCharacteristics } from "../../config/ApiPage"; // Импорт функции API

const Filter = ({ categoryId, onFilterChange }) => {
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const data = await getSortCharacteristics(categoryId);
        setCharacteristics(data);
      } catch (error) {
        console.error("Error fetching sort characteristics:", error);
      }
    };

    if (categoryId) fetchCharacteristics();
  }, [categoryId]);

  const handleFilterChange = (characteristicId, valueId) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[characteristicId] === valueId) {
        delete updatedFilters[characteristicId]; // Remove filter if already selected
      } else {
        updatedFilters[characteristicId] = valueId; // Add new filter
      }
      onFilterChange(updatedFilters); // Notify parent component
      return updatedFilters;
    });
  };

  return (
    <div className="filter__container">
      {characteristics.map((char) => (
        <div key={char.id} className="filter__characteristic">
          <p className="filter__characteristic-text">{char.name}</p>
          <div className="filter__characteristic-group">
            {char.values.map((value) => (
              <div
                key={value.id}
                className={`filter__characteristic-group-value-row ${
                  selectedFilters[char.id] === value.id ? "selected" : ""
                }`}
                onClick={() => handleFilterChange(char.id, value.id)}
              >
                <div className="filter__characteristic-group-value-row-icon">
                  <input
                    type="checkbox"
                    checked={selectedFilters[char.id] === value.id}
                    readOnly
                  />
                </div>
                <span className="filter__characteristic-group-value-row-text-main">
                  {value.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;
