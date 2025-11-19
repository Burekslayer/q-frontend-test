// Header.jsx
import React from "react";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="studio-header">
      <nav className="studio-nav">
        <a href="/" className="studio-nav-item">Home</a>
        <a href="/search" className="studio-nav-item">Search</a>
        <a href="/login" className="studio-nav-item accent">Sign In</a>
      </nav>
    </header>
  );
}
