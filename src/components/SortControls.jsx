import React from 'react';
import { useProducts } from '../context/ProductContext';

function SortControls() {
  const { sortBy, sortProductsBy } = useProducts();

  const handleSortChange = (e) => {
    sortProductsBy(e.target.value);
  };

  return (
    <div>
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
        Sort By
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={handleSortChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="grade-asc">Nutrition Grade (Best First)</option>
        <option value="grade-desc">Nutrition Grade (Worst First)</option>
      </select>
    </div>
  );
}

export default SortControls;
