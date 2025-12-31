import React, { createContext, useContext, useReducer, useEffect } from 'react';
import OpenFoodFactsAPI from '../services/openFoodFactsApi';

const ProductContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH: 'SET_SEARCH',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SORT: 'SET_SORT',
  SET_PAGE: 'SET_PAGE',
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE'
};

// Initial state
const initialState = {
  products: [],
  categories: [],
  cart: [],
  favorites: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
  sortBy: 'name-asc',
  currentPage: 1,
  totalProducts: 0,
  hasMore: true
};

// Reducer function
function productReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.replace ? action.payload.products : [...state.products, ...action.payload.products],
        totalProducts: action.payload.total,
        currentPage: action.payload.page,
        hasMore: action.payload.products.length === action.payload.pageSize,
        loading: false,
        error: null
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.SET_SEARCH:
      return { ...state, searchTerm: action.payload, currentPage: 1, products: [] };

    case ACTIONS.SET_CATEGORY:
      return { ...state, selectedCategory: action.payload, currentPage: 1, products: [] };

    case ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload };

    case ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload };

    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ACTIONS.ADD_TO_CART:
      return { ...state, cart: [...state.cart, action.payload] };

    case ACTIONS.REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter(item => item.code !== action.payload) };

    case ACTIONS.TOGGLE_FAVORITE:
      const isFavorite = state.favorites.some(item => item.code === action.payload.code);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(item => item.code !== action.payload.code)
          : [...state.favorites, action.payload]
      };

    default:
      return state;
  }
}

// Provider component
export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when search, category, or page changes
  useEffect(() => {
    if (state.searchTerm || state.selectedCategory || state.currentPage > 1) {
      loadProducts();
    }
  }, [state.searchTerm, state.selectedCategory, state.currentPage]);

  const loadCategories = async () => {
    try {
      const categories = await OpenFoodFactsAPI.getCategories();
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories.slice(0, 50) }); // Limit to 50 categories
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const loadProducts = async (replace = false) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await OpenFoodFactsAPI.getProducts(
        state.currentPage,
        20,
        state.selectedCategory,
        state.searchTerm
      );

      // Apply sorting
      const sortedProducts = sortProducts(result.products, state.sortBy);

      dispatch({
        type: ACTIONS.SET_PRODUCTS,
        payload: { ...result, products: sortedProducts, replace }
      });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const sortProducts = (products, sortBy) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.product_name || '').localeCompare(b.product_name || '');
        case 'name-desc':
          return (b.product_name || '').localeCompare(a.product_name || '');
        case 'grade-asc':
          return (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z');
        case 'grade-desc':
          return (b.nutrition_grades || 'z').localeCompare(a.nutrition_grades || 'z');
        default:
          return 0;
      }
    });
  };

  const searchProducts = (term) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: term });
  };

  const filterByCategory = (category) => {
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: category });
  };

  const sortProductsBy = (sortBy) => {
    dispatch({ type: ACTIONS.SET_SORT, payload: sortBy });
    // Re-sort current products
    const sortedProducts = sortProducts(state.products, sortBy);
    dispatch({
      type: ACTIONS.SET_PRODUCTS,
      payload: {
        products: sortedProducts,
        total: state.totalProducts,
        page: state.currentPage,
        pageSize: 20,
        replace: true
      }
    });
  };

  const loadMore = () => {
    if (state.hasMore && !state.loading) {
      dispatch({ type: ACTIONS.SET_PAGE, payload: state.currentPage + 1 });
    }
  };

  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productCode) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productCode });
  };

  const toggleFavorite = (product) => {
    dispatch({ type: ACTIONS.TOGGLE_FAVORITE, payload: product });
  };

  const value = {
    ...state,
    searchProducts,
    filterByCategory,
    sortProductsBy,
    loadMore,
    addToCart,
    removeFromCart,
    toggleFavorite
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
