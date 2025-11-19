// Footer.jsx
import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="studio-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">Explore</h4>
          <a href="/" className="footer-item">Home</a>
          <a href="/search" className="footer-item">Search</a>
          <a href="/login" className="footer-item">Sign In</a>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">About</h4>
          <a href="/about" className="footer-item">Our Story</a>
          <a href="/artists" className="footer-item">Artists</a>
          <a href="/contact" className="footer-item">Contact</a>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <a href="/terms" className="footer-item">Terms</a>
          <a href="/privacy" className="footer-item">Privacy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kreativni Univerzum · All Rights Reserved</p>
      </div>
    </footer>
  );
}
