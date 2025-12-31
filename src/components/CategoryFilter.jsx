import React from 'react';
import { useProducts } from '../context/ProductContext';

function CategoryFilter() {
  const { categories, selectedCategory, filterByCategory } = useProducts();

  const handleCategoryChange = (e) => {
    filterByCategory(e.target.value);
  };

  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
