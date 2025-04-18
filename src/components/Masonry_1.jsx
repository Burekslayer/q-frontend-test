import React, { useState } from 'react';
import '../pages/styles/Masonry.css';

const MasonryLayout = ({ images, columns = 8 }) => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleClick = (index) => {
    setFocusedIndex(index === focusedIndex ? null : index);
  };

  // Prepare empty columns
  const columnWrappers = Array.from({ length: columns }, () => []);
  console.log(images)
  if (focusedIndex === null) {
    // Normal distribution
    images.forEach((image, index) => {
      const col = index % columns;
      columnWrappers[col].push(
        <div key={image.id} className="masonry-item" onClick={() => handleClick(index)}>
          <img src={image.src} alt={image.alt} className="masonry-img" />
        </div>
      );
    });
  } else {
    // Centered focus: one image spans center column, others fill 6 columns evenly
    const otherPhotos = images.filter((_, idx) => idx !== focusedIndex);
    otherPhotos.forEach((image, idx) => {
      // Determine column: columns 0–2 left, 4–6 right
      const zoneIndex = idx % 6;
      const col = zoneIndex < 3 ? zoneIndex : zoneIndex + 1;
      const originalIndex = images.findIndex(p => p.id === image.id);
      columnWrappers[col].push(
        <div key={image.id} className="masonry-item" onClick={() => handleClick(originalIndex)}>
          <img src={image.src} alt={image.alt} className="masonry-img" />
        </div>
      );
    });

    // Center column (index 3): focused image + info panel
    const focusedImage = images[focusedIndex];
    columnWrappers[3].push(
      <div
        key={focusedImage.id}
        className="masonry-item expanded"
        onClick={() => handleClick(focusedIndex)}
      >
        <img
          src={focusedImage.src}
          alt={focusedImage.alt}
          className="masonry-img focused"
        />

        {/* ← Info panel beneath the focused image */}
        <div className="focused-info">
          <div className='focused-left'>
            <p className="info-artist">{focusedImage.alt}</p>
            <p className="info-tags">{focusedImage.tags?.join(', ')}</p>
          </div>
          <div className='focused-right'>
            <p className="info-price">{focusedImage.paintingPrice}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`masonry-container ${focusedIndex !== null ? 'focused' : ''}`}>
      {columnWrappers.map((colItems, idx) => (
        <div key={idx} className={`column column-${idx}`}>
          {colItems}
        </div>
      ))}
    </div>
  );
};

export default MasonryLayout;
