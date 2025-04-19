import React from 'react';
import '../pages/styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© 2025 Your Company. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="#">Privacy Policy</a>
          <span> | </span>
          <a href="#">Terms of Service</a>
          <span> | </span>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
