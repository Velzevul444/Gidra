import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';

const Header: React.FC = () => {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="announcement-bar"><span>Бесплатная доставка</span> при заказе от 5 000 ₽ <span className="announcement-sparkle">✦</span></div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Gidra — на главную">
            <span className="brand-mark" aria-hidden="true">
              <img src="/images/gidra-mark.png" alt="" />
            </span>
            <span>gidra<span className="brand-period">.</span></span>
          </Link>
          <nav className="main-nav" aria-label="Основная навигация">
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
          </nav>
          <div className="header-actions">
            <Link to="/cart" className="cart-link" aria-label={`Корзина, товаров: ${count}`}>
              <span aria-hidden="true">♧</span><span>Корзина</span><span className="cart-count">{count}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;