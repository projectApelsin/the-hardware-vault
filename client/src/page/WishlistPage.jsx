import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getWishlistPage } from "../config/ApiCustomer";
import ProductList from "../component/ProductList/ProductList";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Следим за изменением маршрута

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true); // Показываем индикатор загрузки перед запросом
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
  }, [location.pathname]); // Перезапуск при изменении маршрута

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {wishlist && <ProductList productGroup={wishlist} />}
    </div>
  );
};

export default WishlistPage;
