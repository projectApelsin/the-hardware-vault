import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderComponent from './component/Header/HeaderComponent';
import FooterComponent from './component/Footer/FooterComponent';
import ProductDetailsPage from './page/ProductDetailsPage';
import WishlistPage from './page/WishlistPage';
import HomePage from './page/HomePage';
import FilterComponent from './component/Filter/FilterCharacterisctic';
import CategoryPage from './page/CategoryPage';

import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const [filters, setFilters] = useState({});

  const handleFilterChange = (selectedFilters) => {
    console.log("Selected filters:", selectedFilters);
    setFilters(selectedFilters);
  };

  return (
    <Router>
      {/* Компоненты, которые всегда должны отображаться */}
      <HeaderComponent />
      <div className="main-content">
        <Routes>
          {/* Главная страница или другие маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productDetails/:productId" element={<ProductDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/category/:id" element={<CategoryPage/>}/>

          {/* Добавьте другие маршруты по мере необходимости */}
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;
