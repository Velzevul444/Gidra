import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category || ''))).filter(Boolean);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category ? p.category === category : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="storefront catalog-page">
      <div className="catalog-intro">
        <span className="section-kicker">КОЛЛЕКЦИЯ GIDRA</span>
        <h1>Каталог товаров</h1>
        <p>Всё, что нужно для работы, отдыха и маленьких радостей.</p>
      </div>
      <div className="catalog-layout">
        <FilterSidebar categories={categories} selected={category} onSelect={setCategory} />
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <SearchBar onSearch={setSearch} />
            <span>{filtered.length} товаров</span>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty-search">Товары не найдены. Измените поиск или категорию.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;