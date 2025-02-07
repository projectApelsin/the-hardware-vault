import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HeaderComponent from "./component/Header/HeaderComponent";
import FooterComponent from "./component/Footer/FooterComponent";
import ProductDetailsPage from "./page/ProductDetailsPage";
import WishlistPage from "./page/WishlistPage";
import HomePage from "./page/HomePage";
import CategoryPage from "./page/CategoryPage";

import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/productDetails/:productId"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetailsPage />
            </motion.div>
          }
        />
        <Route
          path="/wishlist"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WishlistPage />
            </motion.div>
          }
        />
        <Route
          path="/category/:id"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <HeaderComponent /> {/* Фиксированный хедер */}
      <div className="content">
        <AnimatedRoutes />
      </div>
      <FooterComponent /> {/* Фиксированный футер */}
    </Router>
  );
}

export default App;
