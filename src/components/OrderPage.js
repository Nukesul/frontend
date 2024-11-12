import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OrderPage.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Инициализация useNavigate
  const { cartItems: initialCartItems } = location.state;

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isOrderSection, setIsOrderSection] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    comments: "",
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    comments: "",
  });

  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(item.quantity + change, 1) };
        }
        return item;
      });
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails({ ...deliveryDetails, [name]: value });
  };

  // Функция для отправки данных заказа в Telegram
  const sendOrderToTelegram = async () => {
    try {
      // Преобразуем объекты данных в строку запроса для URL
      const queryParams = new URLSearchParams({
        orderDetails: JSON.stringify(orderDetails),
        deliveryDetails: JSON.stringify(deliveryDetails),
        cartItems: JSON.stringify(cartItems),
      });

      const response = await fetch(`https://nukesul-backend-1bde.twc1.net/api/send-order?${queryParams.toString()}`, {
        method: 'GET',
      });

      if (response.ok) {
        alert('Заказ успешно отправлен в Telegram!');
        setCartItems([]);  // Обнуляем корзину
        navigate("/");  // Возвращаем на главную страницу
      } else {
        alert('Ошибка при отправке заказа.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке заказа.');
    }
  };

  return (
    <div className="order-page">
      <div className="button-group">
        <button className="button_buy" onClick={() => setIsOrderSection(true)}>
          Заказ
        </button>
        <button className="button_buy" onClick={() => setIsOrderSection(false)}>
          Доставка
        </button>
      </div>

      <div className="items-section">
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <img src={`https://nukesul-backend-1bde.twc1.net${item.image}`} alt={item.name} />
            <div className="order-item-info">
              <h3>{item.name}</h3>
              <p>{item.price} сом</p>
              <div className="ad_more">
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-details">
        <h3 className="total-price">Итого: {calculateTotal()} сом</h3>

        <h2>
          {isOrderSection ? "Заказ" : "Доставка"}
        </h2>
        {isOrderSection ? (
          <>
            <div className="input-group">
              <label htmlFor="order-name">Имя:</label>
              <input
                type="text"
                name="name"
                value={orderDetails.name}
                onChange={handleOrderChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="order-phone">Телефон:</label>
              <input
                type="tel"
                name="phone"
                value={orderDetails.phone}
                onChange={handleOrderChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="order-comments">Комментарии:</label>
              <textarea
                name="comments"
                value={orderDetails.comments}
                onChange={handleOrderChange}
              ></textarea>
            </div>
          </>
        ) : (
          <>
            <div className="input-group">
              <label htmlFor="delivery-name">Имя:</label>
              <input
                type="text"
                name="name"
                value={deliveryDetails.name}
                onChange={handleDeliveryChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="delivery-phone">Телефон:</label>
              <input
                type="tel"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleDeliveryChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="delivery-address">Адрес:</label>
              <input
                type="text"
                name="address"
                value={deliveryDetails.address}
                onChange={handleDeliveryChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="delivery-comments">Комментарии:</label>
              <textarea
                name="comments"
                value={deliveryDetails.comments}
                onChange={handleDeliveryChange}
              ></textarea>
            </div>
          </>
        )}
        <div className="buttons">
          <button
            style={{borderRadius:'18px',fontSize:'17px', border:'none',backgroundColor:'red', color:'white', padding:'0 10px'}}
            onClick={() => navigate("/")}
          >
            Вернуться в меню
          </button>
          <button className="confirm-button" onClick={sendOrderToTelegram}>
            Подтвердить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
