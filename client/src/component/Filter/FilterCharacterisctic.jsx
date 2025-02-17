import React, { useState, useEffect } from "react";
import { getSortCharacteristics, getSearchSortCharacteristics } from "../../config/ApiPage";

const FilterCharacteristic = ({ categoryId, query, onFilterChange }) => {
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    if (!categoryId && !query) return; // Если нет categoryId и query, не делать запрос

    const fetchCharacteristics = async () => {
      try {
        let data;
        if (query) {
          // Если query есть, выполняем запрос по query
          data = await getSearchSortCharacteristics(query);
        } else if (categoryId) {
          // Если query нет, но есть categoryId, выполняем запрос по categoryId
          data = await getSortCharacteristics(categoryId);
        }
        setCharacteristics(data);
      } catch (error) {
        console.error("Ошибка загрузки характеристик:", error);
      }
    };

    fetchCharacteristics();
  }, [categoryId, query]); // Добавляем query в зависимость

  const handleFilterChange = (characteristicName, valueId) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[characteristicName]) {
        // Если фильтр уже есть, проверяем, выбран ли данный фильтр
        const isSelected = updatedFilters[characteristicName].includes(valueId);
        if (isSelected) {
          // Убираем значение
          updatedFilters[characteristicName] = updatedFilters[characteristicName].filter(id => id !== valueId);
        } else {
          // Добавляем значение
          updatedFilters[characteristicName].push(valueId);
        }
      } else {
        // Если фильтр еще не существует, добавляем новый
        updatedFilters[characteristicName] = [valueId];
      }
      onFilterChange(updatedFilters); // Передаем обновленные фильтры в родительский компонент
      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-10 w-90">
      {characteristics.map((char) => (
        <div key={char.characteristicName} className="bg-smalt-100 rounded-2xl p-7 flex flex-col gap-5">
          <p className="font-montserrat font-semibold text-xl">{char.characteristicName}</p>
          <div className="flex flex-wrap gap-4">
            {char.values.map((value) => {
              const isSelected = selectedFilters[char.characteristicName]?.includes(value.valueId);
              return (
                <div
                  key={value.valueId}  // Используем уникальный ключ для каждого значения
                  className="flex flex-row gap-2 cursor-pointer justify-between"
                  onClick={() => handleFilterChange(char.characteristicName, value.valueId)}
                >
                  <img
                    src={isSelected ? "/icons/checkbox-fill.png" : "/icons/carbon-checkbox.png"}
                    alt="checkbox"
                    className="w-4 h-4 object-contain duration-500"
                  />
                  <span className="font-normal">{value.valueTitle}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterCharacteristic;
