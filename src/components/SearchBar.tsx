import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setValue(term);
    onSearch(term);
  };
  return (
    <input
      type="text"
      placeholder="Найти что-то особенное…"
      aria-label="Поиск товаров"
      value={value}
      onChange={handleChange}
      className="search-input"
    />
  );
};

export default SearchBar;