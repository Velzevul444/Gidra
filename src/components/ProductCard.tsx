import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../store/cart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCart((state) => state.addItem);

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <span className="product-badge">Хит</span>
        {product.image && <img src={product.image} alt={product.name} className="product-image" />}
        <span className="product-quick-view">Подробнее <span aria-hidden="true">↗</span></span>
      </Link>
      <div className="product-card-info">
        <span className="product-category">{product.category || 'Техника'}</span>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-card-bottom">
          <span className="product-price">{product.price.toLocaleString('ru-RU')} ₽</span>
          <button
            type="button"
            className="product-add-button"
            onClick={() => addItem(product)}
            aria-label={`Добавить в корзину: ${product.name}`}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;