import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getRecommended, getDiscounts, getBestSellers, getSimilar } from "../config/ApiCustomer";
import ProductList from "../component/ProductList/ProductList"; // Убедись, что путь правильный

const GroupPage = ({ categoryId = null, budget = null }) => {
  const location = useLocation();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productId = location.state?.productId || null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        let response;
        const requestBody = { categoryId, budget, productId };
        if (location.pathname === "/homePageCategoryDetails/similar") {
          
          response = await getSimilar(requestBody);
        }
        else if (location.pathname === "/homePageCategoryDetails/recommended") {
          response = await getRecommended(requestBody);
        } else if (location.pathname === "/homePageCategoryDetails/discount") {
          response = await getDiscounts(requestBody);
        } else if (location.pathname === "/homePageCategoryDetails/bestSeller") {
          response = await getBestSellers(requestBody);
        } else {
          throw new Error("Неизвестный маршрут");
        }

        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname, id, categoryId, budget]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return <div><ProductList productGroup={data} /> </div>;
};

export default GroupPage;
