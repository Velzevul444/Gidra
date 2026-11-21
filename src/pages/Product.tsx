import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { Product } from '../types';
import { useCart } from '../store/cart';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    fetchProducts().then((list) => {
      const p = list.find((p) => p.id === Number(id));
      setProduct(p || null);
    });
  }, [id]);

  if (!product) return <div className="storefront">Загрузка товара…</div>;

  return (
    <div className="storefront product-page">
      <div className="product-detail-image">
        {product.image && <img src={product.image} alt={product.name} />}
      </div>
      <div className="product-detail-info">
        <span className="section-kicker">{product.category || 'КОЛЛЕКЦИЯ GIDRA'}</span>
        <h1>{product.name}</h1>
        <p className="product-description">Продуманная техника для вашего комфорта каждый день. Оригинальный товар с быстрой доставкой и заботливой поддержкой.</p>
        <div className="product-detail-price">{product.price.toLocaleString('ru-RU')} ₽</div>
        <div className="product-stock">● В наличии — доставим быстро</div>
        <button onClick={() => addItem(product)} className="detail-add-button">
          Добавить в корзину <span aria-hidden="true">→</span>
        </button>
        <div className="product-delivery-note">◇ Бесплатная доставка при заказе от 5 000 ₽</div>
      </div>
    </div>
  );
};

export default ProductPage;