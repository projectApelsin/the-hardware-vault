import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fastSearch } from "../../config/ApiPage"; // Импорт функции


const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 3) {
      try {
        const response = await fastSearch(input); // Используем fastSearch
        setResults(response.slice(0, 4)); // Ограничиваем количество результатов на клиенте
      } catch (error) {
        console.error("Ошибка при выполнении поиска:", error.message);
        setResults([]); // Очищаем результаты в случае ошибки
      }
    } else {
      setResults([]); // Если запрос слишком короткий, очищаем результаты
    }
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleCardClick = (id) => {
    navigate(`/productDetails/${id}`);
    setIsActive(false);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setIsActive(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsActive(false);
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const splitResults = (arr) => {
    const middle = Math.ceil(arr.length / 2);
    return [arr.slice(0, middle), arr.slice(middle)];
  };

  const [firstGroup, secondGroup] = splitResults(results);

  return (
    <>
      <div className="flex flex-col " ref={searchRef}>
        <div className="flex flex-row bg-smalt-50 w-[674px] h-[45px] rounded-xs gap-3 relative">
          <img
            className={`w-[32px] ml-2 ${isActive ? "active-icon" : ""}`}
            src={"/icons/Magnifer.svg"}
            alt="Search icon"
          />
          <input
            type="text"
            className={`outline-none border-0 w-full`}
            placeholder="Пошук"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/** Контейнер с результатами поиска */}
        <div
          className={`flex flex-row gap-20 justify-center bg-smalt-500  w-[674px] top-[120px] p-10 rounded-lg shadow-lg 
  transition-all z-1000 absolute duration-300 ease-in-out transform ${isActive && results.length > 0 ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
            }`}
        >
          <div className="flex flex-col gap-5">
            {firstGroup.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleCardClick(product.id)}
              >
                <div>
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="rounded-lg"
                  />
                </div>
                <div className="text-white font-medium font-montserrat text-lg">{product.title}</div>
                <div className="text-white font-semibold font-montserrat text-lg">
                  {product.discountPrice || product.price} ₴
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {secondGroup.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleCardClick(product.id)}
              >
                <div>
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="rounded-lg"
                  />
                </div>
                <div className="text-white font-medium font-montserrat text-lg">{product.title}</div>
                <div className="text-white font-semibold font-montserrat text-lg">
                  {product.discountPrice || product.price} ₴
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default SearchComponent;
