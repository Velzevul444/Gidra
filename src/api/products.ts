import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
};