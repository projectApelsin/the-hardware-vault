import React, { useEffect, useState } from "react";
import { getWishlistPage } from "../config/ApiCustomer"; // Импорт функции для получения вишлиста
import ProductList from "../component/ProductList/ProductList"; // Импорт компонента списка продуктов

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlistPage();
        setWishlist({
          title: data.title || "Ваші обрані товари",
          productCards: data.productCards || [],
        });
      } catch (err) {
        console.error("Ошибка при загрузке вишлиста:", err);
        setError("Не удалось загрузить вишлист.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Компонент ProductList для отображения продуктов */}
      {wishlist && <ProductList productGroup={wishlist} />}
    </div>
  );
};

export default WishlistPage;
