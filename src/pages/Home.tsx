import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const categories = [
  { name: 'Смартфоны', icon: '📱' },
  { name: 'Ноутбуки', icon: '💻' },
  { name: 'Наушники', icon: '🎧' },
  { name: 'Для дома', icon: '🏠' },
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="storefront">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> ТЕХНОЛОГИИ БЛИЖЕ</span>
          <h1><span className="sr-only">Добро пожаловать в Gidra</span>Покупки, которые<br />делают жизнь <span>лучше.</span></h1>
          <p>Находите любимую технику, открывайте новое и наслаждайтесь каждым моментом.</p>
          <Link to="/catalog" className="hero-cta">
            Выбрать покупки <span aria-hidden="true">→</span>
          </Link>
          <div className="hero-note">
            <span className="avatar-stack" aria-hidden="true"><i>А</i><i>М</i><i>Е</i></span>
            <span>Уже выбрали <strong>2 400+</strong> покупателей</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-product">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85"
              alt=""
            />
          </div>
          <div className="hero-float hero-float-top"><span>✦</span> Новинки недели</div>
          <div className="hero-float hero-float-bottom"><span>✳</span> Выгодно каждый день</div>
        </div>
        <div className="hero-sparkle sparkle-one">✳</div>
        <div className="hero-sparkle sparkle-two">✦</div>
      </section>

      <div className="store-benefits">
        <div><span className="benefit-icon">↗</span><span><strong>Быстрая доставка</strong><small>Бережно и в срок</small></span></div>
        <div><span className="benefit-icon">◇</span><span><strong>Только оригиналы</strong><small>Качество без компромиссов</small></span></div>
        <div><span className="benefit-icon">♡</span><span><strong>Заботливая поддержка</strong><small>Всегда на вашей стороне</small></span></div>
      </div>

      <section className="category-section">
        <div className="section-heading">
          <div><span className="section-kicker">НАЙДЁТСЯ ВСЁ</span><h2>Что ищем сегодня?</h2></div>
          <Link to="/catalog" className="text-link">Все категории <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link to="/catalog" className="category-tile" key={category.name}>
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading products-heading">
          <div><span className="section-kicker">ВЫБОР ПОКУПАТЕЛЕЙ</span><h2>{search ? 'Результаты поиска' : 'Популярные товары'}</h2></div>
          <span className="products-caption">{filtered.length} товаров для вас</span>
        </div>
        <div className="home-search"><SearchBar onSearch={setSearch} /></div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-search">Ничего не найдено. Попробуйте изменить запрос.</div>
        )}
      </section>

      <section className="newsletter">
        <div><span className="section-kicker">ХОРОШИЕ НОВОСТИ В ПОЧТУ</span><h2>Будьте на шаг впереди</h2><p>Новинки, вдохновение и приятные предложения — ничего лишнего.</p></div>
        <Link to="/catalog" className="newsletter-cta">Смотреть каталог <span aria-hidden="true">→</span></Link>
        <span className="newsletter-star" aria-hidden="true">✳</span>
      </section>
    </div>
  );
};

export default Home;
