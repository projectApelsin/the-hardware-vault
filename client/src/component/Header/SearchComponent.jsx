import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fastSearch } from "../../config/ApiPage"; // Импорт функции
import "./HeaderComponent.scss";

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
    <div className="header__icons-group-search-area" ref={searchRef}>
       <img
        className={`header__search-icon ${isActive ? "active-icon" : ""}`}
        src={"/icons/Magnifer.svg"}
        alt="Search icon"
      />
      <input
        type="text"
        className={`header__icons-group-search-area-search-line`}
        placeholder="Пошук"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />
      </div>
      {isActive && results.length > 0 && (
        <div className="search__container">
          <div className="search__group">
            {firstGroup.map((product) => (
              <div
                key={product.id}
                className="search__card"
                onClick={() => handleCardClick(product.id)}
              >
                <div className="search__card-top">
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="search__card-icon"
                  />
                </div>
                <div className="search__text">{product.title}</div>
                <div className="search__text">
                  {product.discountPrice || product.price} ₴
                </div>
              </div>
            ))}
          </div>
          <div className="search__group">
            {secondGroup.map((product) => (
              <div
                key={product.id}
                className="search__card"
                onClick={() => handleCardClick(product.id)}
              >
                <div className="search__card-top">
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="search__card-icon"
                  />
                </div>
                <div className="search__text">{product.title}</div>
                <div className="search__text">
                  {product.discountPrice || product.price} ₴
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchComponent;
