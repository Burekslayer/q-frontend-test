// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';         // New interactive home page
import GeneralPage from './pages/GeneralPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import SearchProfiles from './pages/SearchProfiles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Define the logout function here
  const handleLogout = () => {
    setToken(''); // clears the token in App state
    localStorage.removeItem('token'); // or wherever you store it
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return (
    <Router>
      <div className="app">
        <CartProvider>
          <Routes>
            {/* Home Page with interactive image */}
            <Route path="/" element={<HomePage />} />

            {/* Login/Register page */}
            <Route
              path="/login"
              element={!token ? <LoginPage setToken={setToken} /> : <Navigate to="/general" />}
            />

            <Route
              path="/register"
              element={!token ? <RegisterPage /> : <Navigate to="/general" />}
            />

            {/* General page (requires login) */}
            <Route
              path="/general"
              element={token ? <GeneralPage token={token} /> : <Navigate to="/login" />}
            />

            {/* Profile page (requires login) */}
            <Route
              path="/profile"
              element={
                token ? (
                  <ProfilePage token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Public profile page */}
            <Route path="/users/:id" element={<PublicProfilePage />} />

            {/* Search page */}
            <Route path="/search" element={<SearchProfiles />} />

            {/* Product page */}

            <Route path="/product/:id" element={<ProductPage />} />

            {/* Cart page */}

            <Route path="/cart" element={<CartPage />} />
            
            {/* Checkout page */}

            <Route path="/checkout" element={ <CheckoutPage />}/>

          </Routes>
        </CartProvider>

      </div>
    </Router>
  );
}

export default App;
