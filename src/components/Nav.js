import React, { useState } from 'react'; 
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Nav.css'; // Подключаем стили
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-wrapper">
          <div className="navbar-left">
            <div className="brand-container">
              <img className="pizza-logo" src={logo} alt="Logo" />
              <h1 className="brand-name">BOODAI PIZZA</h1>
            </div>
          </div>

          <div className="navbar-right">
        
            <div className="hamburger-menu" onClick={toggleBurgerMenu}>
              {isBurgerMenuOpen ? (
                <FaTimes className="hamburger-icon" />
              ) : (
                <FaBars className="hamburger-icon" />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Отдельный объект ниже навбара для больших экранов */}
      <div className="navbar-links-container">
        <ul className="navbar-links">
          <li><a href="#about">О нас</a></li>
          <li><a href="#contact">Контакты</a></li>
          <li className="divider"></li>
          <li>
            <div className="delivery-details">
              <p className="info-heading">🚗 Доставка к вашему порогу!</p>
              <p className="rating-info">🌟 40 мин • 4,43⭐</p>
            </div>
          </li>
          <li className="divider"></li>
          <li>
            <div className="contact-details">
              <p className="contact-number">📞 +996 • 0 (553) 323-256</p>
              <p className="contact-label">Звонок для заказа</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Меню для мобильных устройств */}
      {isBurgerMenuOpen && (
        <div className="mobile-menu">
          <ul className="navbar-links">
            <li>
              <div className="delivery-details">
                <p className="info-heading">🚗 Доставка к вашему порогу!</p>
                <p className="rating-info">🌟 40 мин • 4,43⭐</p>
              </div>
            </li>
            <li className="divider"></li>
            <li>
              <div className="contact-details">
                <p className="contact-number">📞 +996 • 0 (553) 323-256</p>
                <p className="contact-label">Звонок для заказа</p>
              </div>
            </li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#contact">Контакты</a></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Nav;
