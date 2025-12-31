// Use proxy in development, direct URL in production
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://world.openfoodfacts.org'
  : '';

class OpenFoodFactsAPI {
  // Fetch products with pagination
  static async getProducts(page = 1, pageSize = 20, category = '', search = '') {
    try {
      let url = `${BASE_URL}/cgi/search.pl?json=true&page=${page}&page_size=${pageSize}`;

      if (category) {
        url = `${BASE_URL}/category/${category}.json?page=${page}&page_size=${pageSize}`;
      }

      if (search) {
        url += `&search_terms=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        products: data.products || [],
        total: data.count || 0,
        page: page,
        pageSize: pageSize
      };
    } catch (error) {
      console.error('Error fetching products:', error);

      // Handle specific error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      if (error.message.includes('CORS')) {
        throw new Error('Unable to connect to food database. Please try again in a few moments.');
      }

      throw new Error('Failed to fetch products. Please try again later.');
    }
  }

  // Search product by barcode
  static async getProductByBarcode(barcode) {
    try {
      const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 0) {
        throw new Error('Product not found');
      }

      return data.product;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);

      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      if (error.message.includes('CORS')) {
        throw new Error('Unable to connect to food database. Please try again in a few moments.');
      }

      throw new Error(error.message || 'Failed to fetch product. Please check the barcode.');
    }
  }

  // Get product categories
  static async getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories.json`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.tags || [];
    } catch (error) {
      console.error('Error fetching categories:', error);

      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      if (error.message.includes('CORS')) {
        throw new Error('Unable to connect to food database. Please try again in a few moments.');
      }

      throw new Error('Failed to fetch categories. Please try again later.');
    }
  }

  // Get product image URL with fallback
  static getProductImage(product, size = 'small') {
    const sizes = {
      small: '400',      // Better quality for small images
      medium: '400',     // Standard medium size
      large: 'full'      // Full size for details
    };

    // Try different image sizes in order of preference
    const imageKeys = [
      `image_${sizes[size]}_url`,
      'image_front_url',
      'image_url',
      'image_small_url',
      'image_thumb_url'
    ];

    for (const key of imageKeys) {
      if (product[key]) {
        return product[key];
      }
    }

    // Return a placeholder if no image is available
    return '/placeholder-food.svg';
  }
}

export default OpenFoodFactsAPI;
