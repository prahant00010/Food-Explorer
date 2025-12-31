import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OpenFoodFactsAPI from '../services/openFoodFactsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useProducts } from '../context/ProductContext';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, ShoppingCartIcon as ShoppingCartSolidIcon } from '@heroicons/react/24/solid';

function ProductDetail() {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, toggleFavorite, cart, favorites } = useProducts();

  useEffect(() => {
    loadProduct();
  }, [barcode]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      setProduct(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  const isInCart = cart.some(item => item.code === barcode);
  const isFavorite = favorites.some(item => item.code === barcode);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/3 p-6">
            <img
              src={OpenFoodFactsAPI.getProductImage(product, 'large')}
              alt={product.product_name || 'Food product'}
              className="w-full h-64 object-contain rounded-lg shadow-sm"
              loading="eager"
              onError={(e) => {
                e.target.src = '/placeholder-food.png';
                e.target.alt = 'Food product image not available';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.product_name || 'Unknown Product'}
                </h1>
                {product.brands && (
                  <p className="text-gray-600 mb-2">by {product.brands}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`p-2 rounded-full ${
                    isInCart
                      ? 'text-blue-500'
                      : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  {isInCart ? (
                    <ShoppingCartSolidIcon className="h-6 w-6" />
                  ) : (
                    <ShoppingCartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Nutrition Grade */}
            {product.nutrition_grades && (
              <div className="mb-4">
                <span className="text-sm text-gray-600">Nutrition Grade: </span>
                <span className={`px-2 py-1 rounded text-white font-bold ${
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

            {/* Categories */}
            {product.categories && (
              <div className="mb-4">
                <span className="text-sm text-gray-600">Categories: </span>
                <span className="text-gray-800">{product.categories}</span>
              </div>
            )}

            {/* Labels */}
            {product.labels && (
              <div className="mb-4">
                <span className="text-sm text-gray-600">Labels: </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.labels.split(',').map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {label.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients and Nutrition */}
        <div className="border-t px-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              {product.ingredients_text ? (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.ingredients_text}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">Ingredients not available</p>
              )}
            </div>

            {/* Nutritional Values */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Nutritional Values (per 100g)</h3>
              {product.nutriments ? (
                <div className="space-y-2 text-sm">
                  {product.nutriments.energy_100g && (
                    <div className="flex justify-between">
                      <span>Energy:</span>
                      <span>{Math.round(product.nutriments.energy_100g)} kJ</span>
                    </div>
                  )}
                  {product.nutriments.fat_100g && (
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span>{product.nutriments.fat_100g}g</span>
                    </div>
                  )}
                  {product.nutriments.carbohydrates_100g && (
                    <div className="flex justify-between">
                      <span>Carbohydrates:</span>
                      <span>{product.nutriments.carbohydrates_100g}g</span>
                    </div>
                  )}
                  {product.nutriments.proteins_100g && (
                    <div className="flex justify-between">
                      <span>Proteins:</span>
                      <span>{product.nutriments.proteins_100g}g</span>
                    </div>
                  )}
                  {product.nutriments.salt_100g && (
                    <div className="flex justify-between">
                      <span>Salt:</span>
                      <span>{product.nutriments.salt_100g}g</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nutritional information not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
