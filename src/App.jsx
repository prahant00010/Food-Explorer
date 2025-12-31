import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:barcode" element={<ProductDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;
