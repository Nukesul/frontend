import React, { useState, useEffect } from 'react';
import './../styles/AdminPanel.css';

function AdminPanel() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priceSmall, setPriceSmall] = useState('');
  const [priceMedium, setPriceMedium] = useState('');
  const [priceLarge, setPriceLarge] = useState('');
  const [productsPrice, setProductsPrice] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://boodaikg.com/api/products');
            const data = await response.json();
            console.log('Fetched data:', data);  // Log the response data
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);  // Log any errors
            console.log('Current products state:', products);  // Log products state
        }
    };

    fetchProducts();
  }, []);


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory('');
    resetFormFields();
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    resetPriceFields();
  };

  const resetFormFields = () => {
    setName('');
    setDescription('');
    setImage(null);
    resetPriceFields();
  };

  const resetPriceFields = () => {
    setPriceSmall('');
    setPriceMedium('');
    setPriceLarge('');
    setProductsPrice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    if (image) formData.append('image', image);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (subCategory) formData.append('subCategory', subCategory);
  
    console.log("FormData перед отправкой:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    // Проверка категории "Пиццы" и отправка цены
    if ((category === 'Пиццы' || subCategory === 'Пиццы') && priceSmall) {
      formData.append('priceSmall', parseFloat(priceSmall));
      formData.append('priceMedium', parseFloat(priceMedium));
      formData.append('priceLarge', parseFloat(priceLarge));
    } else if (productsPrice) {
      formData.append('price', parseFloat(productsPrice));
    } else {
      alert('Укажите цену для товара!');
      return;
    }
  
    try {
      const response = await fetch('http://boodaikg.com/api/products', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        alert('Продукт добавлен!');
        resetFormFields();
      } else {
        const errorText = await response.text();
        console.error('Ошибка при добавлении продукта:', errorText);
        alert(`Произошла ошибка при добавлении продукта: ${errorText}`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении продукта:', error);
      alert('Произошла ошибка при добавлении продукта.');
    }
  };
  
  const handleDelete = async (productId) => {
    // Подтверждение удаления
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот продукт?');
    if (!confirmDelete) return;
  
    try {
      // Отправка DELETE-запроса на сервер
      const response = await fetch(`http://boodaikg.com/api/products/${productId}`, {
        method: 'DELETE',
      });
  
      // Если запрос успешен
      if (response.ok) {
        // Обновление состояния, удалив продукт из списка
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        alert('Продукт удален!');
      } else {
        console.error('Ошибка при удалении продукта:', response.statusText);
        alert('Произошла ошибка при удалении продукта.');
      }
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      alert('Произошла ошибка при удалении продукта.');
    }
  };
  

  const renderProductsByCategory = (categoryName) => {
    const filteredProducts = Array.isArray(products) ? products.filter(product => product.category === categoryName) : [];

    return (
      <div className="category-section">
        <h2>{categoryName}</h2>
        <div className="product-cards">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={`http://boodaikg.com${product.image_url}`}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                
                {/* Отображение цены */}
                {product.price_small || product.price_medium || product.price_large ? (
                  <div>
                    {product.price_small && <p>Цена (маленькая): {product.price_small} сом</p>}
                    {product.price_medium && <p>Цена (средняя): {product.price_medium} сом</p>}
                    {product.price_large && <p>Цена (большая): {product.price_large} сом</p>}
                  </div>
                ) : product.price ? (
                  <p>Цена: {product.price} сом</p>
                ) : (
                  <p>Цена не указана</p>
                )}
                
                <button className="delete-button" onClick={() => handleDelete(product.id)}>Удалить</button>
              </div>
            ))
          ) : (
            <p>Нет товаров в этой категории</p>
          )}
        </div>
      </div>
    );
};

  

  return (
    <div className="admin-block">
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>Категория:</label>
          <select value={category} onChange={handleCategoryChange} required>
            <option value="">Выберите категорию</option>
            <option value="Пиццы">Пиццы</option>
            <option value="Бургеры">Бургеры</option> {/* Добавлена категория Бургеры */}
            <option value="Часто продаваемые товары">Часто продаваемые товары</option>
            <option value="Суши">Суши</option>
            <option value="Десерты">Десерты</option>
            <option value="Закуски">Закуски</option>
            <option value="Супы">Супы</option>
            <option value="Вок">Вок</option>
            <option value="Завтраки">Завтраки</option>
            <option value="Шаурмы">Шаурмы</option>
            <option value="Салаты">Салаты</option>
            <option value="Напитки">Напитки</option>
            <option value="Кофе">Кофе</option>
          </select>
        </div>

        {category === 'Часто продаваемые товары' && (
          <div>
            <label>Подкатегория:</label>
            <select value={subCategory} onChange={handleSubCategoryChange} required>
              <option value="">Выберите подкатегорию</option>
              <option value="Пиццы">Пиццы</option>
              <option value="Бургеры">Бургеры</option> {/* Добавлена подкатегория Бургеры */}
              <option value="Суши">Суши</option>
              <option value="Десерты">Десерты</option>
              <option value="Закуски">Закуски</option>
              <option value="Супы">Супы</option>
              <option value="Вок">Вок</option>
              <option value="Завтраки">Завтраки</option>
              <option value="Шаурмы">Шаурмы</option>
              <option value="Салаты">Салаты</option>
              <option value="Напитки">Напитки</option>
              <option value="Кофе">Кофе</option>
            </select>
          </div>
        )}

        {category && (
          <>
            {category === 'Пиццы' || subCategory === 'Пиццы' ? (
              <>
                <div>
                  <label>Цена (Маленькая):</label>
                  <input
                    type="text"
                    value={priceSmall}
                    onChange={(e) => setPriceSmall(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Цена (Средняя):</label>
                  <input
                    type="text"
                    value={priceMedium}
                    onChange={(e) => setPriceMedium(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Цена (Большая):</label>
                  <input
                    type="text"
                    value={priceLarge}
                    onChange={(e) => setPriceLarge(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label>Цена:</label>
                <input
                  type="text"
                  value={productsPrice}
                  onChange={(e) => setProductsPrice(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <div>
          <label>Название товара:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Изображение товара:</label>
          <input type="file" onChange={handleImageChange} required />
        </div>

        <button type="submit">Добавить продукт</button>
      </form>

      <div className="product-list">
        {['Пиццы', 'Бургеры', 'Часто продаваемые товары', 'Суши', 'Десерты', 'Закуски', 'Супы', 'Вок', 'Завтраки', 'Шаурмы', 'Салаты', 'Напитки', 'Кофе'].map(categoryName => renderProductsByCategory(categoryName))}
      </div>
    </div>
  );
}

export default AdminPanel;
