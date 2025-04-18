/* MasonryLayout.jsx */
import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import '../pages/styles/Masonry.css';

/**
 * MasonryLayout with responsive breakpoints
 * Props:
 * - images: array of { id, src, width, height, alt }
 * - baseColumns: number of columns at largest size (default 8)
 * - gap: pixel gap between items (default 20)
 * - spanThreshold: aspect ratio above which to try a multi-col span (default 2.5)
 * - alignTolerance: pixel tolerance for bottom-edge alignment (default 5)
 */
const MasonryLayout = ({
  images,
  baseColumns = 8,
  gap = 20,
  spanThreshold = 2.5,
  alignTolerance = 5,
}) => {
  const [focusedId, setFocusedId] = useState(null);
  const wrapperRef = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  // measure wrapper width
  useLayoutEffect(() => {
    const measure = () => wrapperRef.current && setWrapperWidth(wrapperRef.current.clientWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // pick column count based on breakpoints
  const responsiveColumns = useMemo(() => {
    if (wrapperWidth > 1600) return baseColumns;
    if (wrapperWidth > 1200) return Math.max(baseColumns - 2, 2);
    if (wrapperWidth > 800)  return Math.max(baseColumns - 4, 2);
    return 1;
  }, [wrapperWidth, baseColumns]);

  // effective columns increases when focused
  const effectiveColumns = focusedId ? responsiveColumns + 1 : responsiveColumns;

  // gallery occupies 80% of wrapper
  const galleryWidth = wrapperWidth * 0.8;
  const columnWidth = galleryWidth > 0
    ? (galleryWidth - (effectiveColumns - 1) * gap) / effectiveColumns
    : 0;

  const { items, containerHeight } = useMemo(() => {
    const ordered = focusedId
      ? [images.find(img => img.id === focusedId), ...images.filter(img => img.id !== focusedId)]
      : [...images];

    // track bottoms
    const colHeights = Array(effectiveColumns).fill(0);
    const placed = [];

    ordered.forEach(img => {
      const aspect = img.width / img.height;
      let spanCols = 1;
      let idx, y;

      if (img.id === focusedId) {
        spanCols = 3;
        idx = Math.floor((effectiveColumns - spanCols) / 2);
        y = 0;
      } else {
        idx = colHeights.indexOf(Math.min(...colHeights));
        if (aspect >= spanThreshold) {
          const pairIndex = colHeights.findIndex((h, i) =>
            i < effectiveColumns - 1 && Math.abs(h - colHeights[i + 1]) <= alignTolerance
          );
          if (pairIndex !== -1) {
            spanCols = 2;
            idx = pairIndex;
          }
        }
        y = colHeights[idx];
      }

      const wPx = columnWidth * spanCols + gap * (spanCols - 1);
      const hPx = wPx / aspect;
      const x = idx * (columnWidth + gap);

      for (let j = 0; j < spanCols; j++) {
        colHeights[idx + j] = y + hPx + gap;
      }

      placed.push({ ...img, x, y, w: wPx, h: hPx });
    });

    return { items: placed, containerHeight: Math.max(...colHeights) - gap };
  }, [images, effectiveColumns, galleryWidth, gap, spanThreshold, alignTolerance, focusedId, columnWidth]);

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <div
        className="masonry-container"
        style={{ position: 'relative', width: galleryWidth, height: containerHeight, margin: '0 auto' }}
      >
        {items.map(item => (
          <div
            key={item.id}
            className={`masonry-item${item.id === focusedId ? ' focused' : ''}`}
            style={{
              position: 'absolute', top: item.y, left: item.x,
              width: item.w, height: item.h,
              overflow: 'hidden', cursor: 'pointer', transition: 'all 300ms ease',
              zIndex: item.id === focusedId ? 10 : 1
            }}
            onClick={() => setFocusedId(item.id === focusedId ? null : item.id)}
          >
            <img src={item.src} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryLayout;
