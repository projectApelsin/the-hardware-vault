import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterCharacteristic from "../component/Filter/FilterCharacterisctic";
import { getSearchResultPage } from "../config/ApiPage";
import ProductCard from "../component/ProductCard/ProductCard";

const SearchResultPage = () => {
    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState([]);
    const { query } = useParams(""); // Получаем query из URL

    useEffect(() => {
        const fetchSearchResultPage = async () => {
            try {
                // Передаем фильтры в запрос
                const data = await getSearchResultPage(query, 0, filters);
                setProducts(data.productCards || []);
                setTitle(data.title || []);
                console.log(query, filters);
            } catch (error) {
                console.error("Ошибка загрузки результатов поиска:", error);
                console.log(query, filters);
            }
        };

        fetchSearchResultPage();
    }, [query, filters]); // Обновляем товары при изменении `query` или `filters`

    const handleFilterChange = (selectedFilters) => {
        setFilters(selectedFilters);  // Обновляем фильтры
    };

    return (
        <div className="flex flex-col mt-10 mb-20">
            <div className="flex flex-col ml-30 gap-5">
                <div className="font-montserrat font-bold text-2xl">{title}</div>
                <div className="font-montserrat font-medium text-xl">{query}</div>
            </div>
            <div className="flex flex-row ml-30 mt-10">
                <FilterCharacteristic categoryId={null} query={query} onFilterChange={handleFilterChange} />
            
            <div className="ml-25 flex flex-wrap gap-6">
                {products.map((product) => (
                    <div key={product.id}>
                        <ProductCard {...product} /> {/* Отправляем каждый продукт в компонент ProductCard */}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default SearchResultPage;
