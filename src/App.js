import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Nav from './components/Nav';
import Footer from './components/Footer';
import Products from './components/Products';
import Cart from './components/Cart';
import OrderPage from './components/OrderPage';
import AdminPanel from './components/AdminPanel';
import Adminlogin from './components/adminlogin/Adminlogin';

function App() {
  const userId = 1; // Замените на нужное значение
  const [cartItems, setCartItems] = React.useState([]);

  const updateCart = (id, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Убираем товары с количеством 0

      return updatedItems;
    });
  };

  return (
    <Router>
      <Routes>
        {/* Главная страница с Nav, Products и Footer */}
        <Route 
          path="/" 
          element={
            <div>
              <Nav />
              <Products updateCart={updateCart} /> {/* Передаем updateCart в Products */}
              <Footer />
              <Cart cartItems={cartItems} updateCart={updateCart} /> {/* Вставляем компонент Cart на главной странице */}
            </div>
          } 
        />

        {/* Страница оформления заказа */}
        <Route 
          path="/order" 
          element={<OrderPage cartItems={cartItems} updateCart={updateCart} />} 
        />

        {/* Страница Admin */}
        <Route path="/Admin" element={<Adminlogin userId={userId} />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
