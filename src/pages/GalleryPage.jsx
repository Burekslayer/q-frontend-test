// GalleryPage.js
import React, { useState } from 'react';
import './styles/GalleryPage.css';

function GalleryPage() {
  // State to trigger the disintegration (fade-out/slide-out) animation
  const [disintegrate, setDisintegrate] = useState(false);

  const handleReturnHome = () => {
    // Trigger the animation
    setDisintegrate(true);
    // Optionally, after the animation finishes, scroll to top or perform other actions
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // If you want to remove the gallery content from the DOM after animation, do it here.
    }, 500); // adjust to your CSS transition duration
  };

  return (
    <div className="page-container">
      {/* Fixed Background: Always visible in the background */}
      <div className="fixed-background">
        {/* You can include your easel, picture, chair here (or as part of an SVG) */}
        <img src="/images/atelje.jpg" alt="Studio Background" />
        <img src="/images/stafelaj.png" alt="Easel" className="easel" />
        <img src="/images/stolica.png" alt="Chair" className="chair" />
      </div>

      {/* Gallery Content: Scrollable content that sits above the fixed background */}
      <div className={`gallery-content ${disintegrate ? "disintegrate" : ""}`}>
        <h2>Gallery</h2>
        {/* Your gallery items here */}
        <div className="gallery-items">
          {/* Example gallery items */}
          <div className="gallery-item">Artwork 1</div>
          <div className="gallery-item">Artwork 2</div>
          <div className="gallery-item">Artwork 3</div>
          {/* ... */}
        </div>
      </div>

      {/* Navigation Bar: Fixed at top */}
      <nav className="nav-bar">
        <button onClick={handleReturnHome}>Return to Home</button>
      </nav>
    </div>
  );
}

export default GalleryPage;
