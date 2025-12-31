import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';

function Header() {
  const { cart, favorites } = useProducts();
  const [barcodeSearch, setBarcodeSearch] = useState('');

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    if (barcodeSearch.trim()) {
      try {
        // This will be handled by the search component
        window.location.href = `/product/${barcodeSearch.trim()}`;
      } catch (error) {
        alert('Product not found. Please check the barcode and try again.');
      }
      setBarcodeSearch('');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">
            FoodExplorer
          </Link>

          <div className="flex items-center space-x-4">
            {/* Barcode Search */}
            <form onSubmit={handleBarcodeSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Scan barcode..."
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Cart and Favorites */}
            <div className="flex items-center space-x-2">
              <Link
                to="/favorites"
                className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
