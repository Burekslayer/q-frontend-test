// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';         // New interactive home page
import AuthPage from './pages/AuthPage';           // Login/Register page
import GeneralPage from './pages/GeneralPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import SearchProfiles from './pages/SearchProfiles';
import "./App.css";

function App() {
  const [token, setToken] = useState('');

  // Define the logout function here
  const handleLogout = () => {
    setToken(''); // clears the token in App state
    localStorage.removeItem('authToken'); // or wherever you store it
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home Page with interactive image */}
          <Route path="/" element={<HomePage />} />

          {/* Login/Register page */}
          <Route
            path="/login"
            element={!token ? <AuthPage setToken={setToken} /> : <Navigate to="/general" />}
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
          <Route path="/user/:username" element={<PublicProfilePage />} />

          {/* Search page */}
          <Route path="/search" element={<SearchProfiles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
