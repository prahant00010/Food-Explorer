import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import OpenFoodFactsAPI from '../services/openFoodFactsApi';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function ProductCard({ product }) {
  const { addToCart, toggleFavorite, cart, favorites } = useProducts();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const isInCart = cart.some(item => item.code === product.code);
  const isFavorite = favorites.some(item => item.code === product.code);

  return (
    <Link
      to={`/product/${product.code}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="relative">
        <img
          src={OpenFoodFactsAPI.getProductImage(product, 'small')}
          alt={product.product_name || 'Food product'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-food.png';
            e.target.alt = 'Food product image not available';
          }}
        />

        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full bg-white shadow-md ${
              isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <HeartIcon className="h-4 w-4" />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`p-2 rounded-full bg-white shadow-md ${
              isInCart
                ? 'text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Nutrition grade badge */}
        {product.nutrition_grades && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded text-white font-bold text-sm ${
              product.nutrition_grades === 'a' ? 'bg-green-500' :
              product.nutrition_grades === 'b' ? 'bg-lime-500' :
              product.nutrition_grades === 'c' ? 'bg-yellow-500' :
              product.nutrition_grades === 'd' ? 'bg-orange-500' :
              product.nutrition_grades === 'e' ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              {product.nutrition_grades.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.product_name || 'Unknown Product'}
        </h3>

        {product.categories && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {product.categories.split(',')[0]}
          </p>
        )}

        {product.ingredients_text && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.ingredients_text.substring(0, 100)}...
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
