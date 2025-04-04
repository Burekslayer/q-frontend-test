// src/pages/GeneralPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function GeneralPage({ token }) {
  return (
    <div className="general-container">
      <h1>Welcome Back!</h1>
      <p>This is the general page after login.</p>
      <Link to="/profile">
        <button>Go to Profile</button>
      </Link>
    </div>
  );
}

export default GeneralPage;
