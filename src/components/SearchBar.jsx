import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchBar() {
  const { searchProducts, searchTerm } = useProducts();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        searchProducts(localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchProducts, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchProducts(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    searchProducts('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
