// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import GeneralPage from './pages/GeneralPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage'
import SearchProfiles from './pages/SearchProfiles';
import "./App.css"
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
          <Route
            path="/"
            element={!token ? <AuthPage setToken={setToken} /> : <Navigate to="/general" />}
          />
          <Route
            path="/general"
            element={token ? <GeneralPage token={token} /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={
              token ? (
                // Pass handleLogout in as onLogout
                <ProfilePage token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/user/:username" element={<PublicProfilePage />} />
          <Route path="/search" element={<SearchProfiles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
