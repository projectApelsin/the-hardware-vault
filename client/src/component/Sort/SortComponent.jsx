import React, { useState } from "react";


const SortComponent = ({ sortCriteria, setSortCriteria }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <div className="bg-smalt-100 w-80 p-4 rounded-xl cursor-pointer mb-4" onClick={() => setIsOpen(!isOpen)}>
        <p className="font-montserrat font-medium ml-5">{sortCriteria ? `${sortCriteria}` : "Сортувати за"}</p>
      </div>
      {isOpen && (
        <div className="bg-smalt-100 duration-300 flex-col rounded-xl h-35 flex gap-4 pt-5 pb-5 absolute z-50 w-80 cursor-pointer">
          {["Цiна (за зростанням)", "Цiна (за спаданням)", "За назвою"].map((option) => (
            <div
              key={option}
              className="ml-9 flex "
              onClick={() => {
                setSortCriteria(option);
                setIsOpen(false);
              }}
            >
              <p className="font-montserrat font-medium">{option}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortComponent;
