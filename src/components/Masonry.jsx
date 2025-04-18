/* MasonryLayout.jsx */
import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import '../pages/styles/Masonry.css';

/**
 * MasonryLayout
 * Props:
 * - images: array of { id, src, width, height, alt }
 * - columns: base number of columns (default 8)
 * - gap: pixel gap between items (default 20)
 * - spanThreshold: aspect ratio above which to try a multi-col span (default 2.5)
 * - alignTolerance: pixel tolerance for bottom-edge alignment (default 5)
 */
const MasonryLayout = ({
  images,
  columns = 8,
  gap = 20,
  spanThreshold = 2.5,
  alignTolerance = 5,
}) => {
  const [focusedId, setFocusedId] = useState(null);
  const wrapperRef = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  // Measure wrapper width for responsive sizing
  useLayoutEffect(() => {
    const measure = () => {
      if (wrapperRef.current) setWrapperWidth(wrapperRef.current.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Determine effective columns: increase by 1 when focused
  const effectiveColumns = focusedId ? columns + 1 : columns;

  // Gallery width is 80% of wrapper
  const galleryWidth = wrapperWidth * 0.8;
  // Compute column width based on effective columns
  const columnWidth = galleryWidth > 0
    ? (galleryWidth - (effectiveColumns - 1) * gap) / effectiveColumns
    : 0;

  const { items, containerHeight } = useMemo(() => {
    // Place focused first
    const ordered = focusedId
      ? [images.find(img => img.id === focusedId), ...images.filter(img => img.id !== focusedId)]
      : [...images];

    // Track bottom Y for each effective column
    const colHeights = Array(effectiveColumns).fill(0);
    const placed = [];

    ordered.forEach(img => {
      const aspect = img.width / img.height;
      let spanCols = 1;
      let idx;
      let y;

      if (img.id === focusedId) {
        // Focused: span 3 columns, centered
        spanCols = 3;
        idx = Math.floor((effectiveColumns - spanCols) / 2);
        y = 0;
      } else {
        // find shortest column
        idx = colHeights.indexOf(Math.min(...colHeights));
        // consider 2-col spans for wide images
        if (aspect >= spanThreshold) {
          const pairIndex = colHeights.findIndex((h, i) =>
            i < effectiveColumns - 1 &&
            Math.abs(h - colHeights[i + 1]) <= alignTolerance
          );
          if (pairIndex !== -1) {
            spanCols = 2;
            idx = pairIndex;
          }
        }
        y = colHeights[idx];
      }

      // compute placement
      const widthPx = columnWidth * spanCols + gap * (spanCols - 1);
      const heightPx = widthPx / aspect;
      const x = idx * (columnWidth + gap);

      // update column bottoms
      for (let j = 0; j < spanCols; j++) {
        colHeights[idx + j] = y + heightPx + gap;
      }

      placed.push({ ...img, x, y, w: widthPx, h: heightPx });
    });

    return {
      items: placed,
      containerHeight: Math.max(...colHeights) - gap,
    };
  }, [images, effectiveColumns, galleryWidth, gap, spanThreshold, alignTolerance, focusedId]);

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <div
        className="masonry-container"
        style={{
          position: 'relative',
          width: galleryWidth,
          height: containerHeight,
          margin: '0 auto',
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            className={`masonry-item${item.id === focusedId ? ' focused' : ''}`}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              width: item.w,
              height: item.h,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 50ms ease',
              zIndex: item.id === focusedId ? 10 : 1,
            }}
            onClick={() => setFocusedId(item.id === focusedId ? null : item.id)}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryLayout;