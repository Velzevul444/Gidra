import React from 'react';

interface FilterSidebarProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories, selected, onSelect }) => (
  <aside className="filter-sidebar">
    <div className="filter-title">Категории</div>
    <ul>
      <li>
        <button className={!selected ? 'selected' : ''} onClick={() => onSelect('')}>
          Все товары
        </button>
      </li>
      {categories.map((cat) => (
        <li key={cat}>
          <button
            onClick={() => onSelect(cat)}
            className={cat === selected ? 'selected' : ''}
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default FilterSidebar;