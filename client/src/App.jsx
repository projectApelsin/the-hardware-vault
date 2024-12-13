import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderComponent from './component/Header/HeaderComponent';
import FooterComponent from './component/Footer/FooterComponent';
import ProductDetailsPage from './page/ProductDetailsPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {/* Компоненты, которые всегда должны отображаться */}
      <HeaderComponent />
      <div className="main-content">
        <Routes>
          {/* Главная страница или другие маршруты */}
          <Route path="/productDetails/:productId" element={<ProductDetailsPage />} />
          {/* Добавьте другие маршруты по мере необходимости */}
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;
