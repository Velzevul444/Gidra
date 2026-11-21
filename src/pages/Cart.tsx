import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';

const Cart: React.FC = () => {
  const { items, removeItem, clear } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="storefront cart-page">
      <div className="catalog-intro">
        <span className="section-kicker">ПОРАДУЙТЕ СЕБЯ</span>
        <h1>Ваша корзина</h1>
        <p>Всё готово — осталось оформить заказ.</p>
      </div>
      {items.length === 0 ? (
        <div className="cart-empty">
          <span aria-hidden="true">♧</span>
          <h2>Пока здесь пусто</h2>
          <p>Самое время найти что-нибудь особенное.</p>
          <Link to="/catalog" className="hero-cta">Перейти в каталог <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              {item.image && <img src={item.image} alt="" />}
              <div className="cart-item-name"><strong>{item.name}</strong><span>{item.quantity} шт.</span></div>
              <strong className="cart-item-price">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</strong>
              <button onClick={() => removeItem(item.id)} className="cart-remove">Удалить</button>
            </div>
          ))}
          </div>
          <aside className="cart-summary">
            <h2>Ваш заказ</h2>
            <div><span>Товары</span><strong>{total.toLocaleString('ru-RU')} ₽</strong></div>
            <div><span>Доставка</span><strong>{total >= 5000 ? 'Бесплатно' : 'от 300 ₽'}</strong></div>
            <div className="cart-total"><span>Итого</span><strong>{total.toLocaleString('ru-RU')} ₽</strong></div>
            <button type="button" className="detail-add-button">Перейти к оформлению <span aria-hidden="true">→</span></button>
            <button onClick={clear} className="cart-clear">Очистить корзину</button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;