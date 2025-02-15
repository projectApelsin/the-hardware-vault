import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HeaderComponent from "./component/Header/HeaderComponent";
import FooterComponent from "./component/Footer/FooterComponent";
import ProductDetailsPage from "./page/ProductDetailsPage";
import WishlistPage from "./page/WishlistPage";
import HomePage from "./page/HomePage";
import CategoryPage from "./page/CategoryPage";
import GroupPage from "./page/GroupPage"; // Подключаем новый компонент

import "./App.css";
import SearchResultPage from "./page/SearchResultPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={<PageWrapper><HomePage /></PageWrapper>}
        />
        <Route
          path="/productDetails/:productId"
          element={<PageWrapper><ProductDetailsPage /></PageWrapper>}
        />
        <Route
          path="/wishlist"
          element={<PageWrapper><WishlistPage /></PageWrapper>}
        />
        <Route
          path="/category/:categoryId"
          element={<PageWrapper><CategoryPage /></PageWrapper>}
        />

        {/* Новые маршруты для GroupPage */}
        <Route
          path="/homePageCategoryDetails/recommended"
          element={<PageWrapper><GroupPage /></PageWrapper>}
        />
        <Route
          path="/homePageCategoryDetails/similar"
          element={<PageWrapper><GroupPage /></PageWrapper>}
        />
        <Route
          path="/homePageCategoryDetails/discount"
          element={<PageWrapper><GroupPage /></PageWrapper>}
        />
        <Route
          path="/homePageCategoryDetails/bestSeller"
          element={<PageWrapper><GroupPage /></PageWrapper>}
        />
        <Route
          path="/search/:query"
          element={<PageWrapper><SearchResultPage /></PageWrapper>}
        />
      </Routes>
    </AnimatePresence>
  );
}

// Компонент-обертка для анимаций
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <HeaderComponent />
      <div className="content">
        <AnimatedRoutes />
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;
