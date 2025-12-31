import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortControls from '../components/SortControls';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    currentPage
  } = useProducts();

  // Load initial products
  useEffect(() => {
    if (products.length === 0 && currentPage === 1 && !loading) {
      loadMore();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar />
          <CategoryFilter />
          <SortControls />
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Load More Button */}
      {hasMore && !loading && products.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* No Products Message */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
