import React from 'react';
import '../pages/styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© 2025 Your Company. All rights reserved.</p>
        <nav className="footer-nav">
          <span>Privacy</span>
          <span> | </span>
          <span>Terms of Service</span>
          <span> | </span>
          <span>Contact</span>
        </nav>
      </div>
    </footer>
  );
}
