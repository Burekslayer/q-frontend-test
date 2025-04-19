/* MasonryLayout.jsx */
import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import '../pages/styles/Masonry.css';
import Footer from '../components/Footer';

/**
 * MasonryLayout with fixed info-panel height and top padding for focused image,
 * responsive breakpoints, infinite loading, and footer
 */
const MasonryLayout = ({
  images,
  fetchMore,
  baseColumns = 8,
  gap = 25,
  spanThreshold = 2.5,
  alignTolerance = 5,
}) => {
  const [focusedId, setFocusedId] = useState(null);
  const [displayCount, setDisplayCount] = useState(50);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const wrapperRef = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  // Fixed heights (px)
  const INFO_PANEL_HEIGHT = 40;
  const TOP_PADDING = 20;
  const GALLERY_TOP_PADDING = 30;

  // Measure container width
  useLayoutEffect(() => {
    const measure = () => {
      if (wrapperRef.current) setWrapperWidth(wrapperRef.current.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Infinite scroll: load more when near bottom (only after manual load)
  useEffect(() => {
    if (focusedId || !hasLoadedMore) return;
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setDisplayCount(prev => prev + 30);
        fetchMore && fetchMore();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchMore, focusedId, hasLoadedMore]);

  // Responsive columns
  const responsiveColumns = useMemo(() => {
    if (wrapperWidth > 1600) return baseColumns;
    if (wrapperWidth > 1200) return Math.max(baseColumns - 2, 2);
    if (wrapperWidth > 800) return Math.max(baseColumns - 4, 2);
    return 1;
  }, [wrapperWidth, baseColumns]);

  const effectiveColumns = focusedId ? responsiveColumns + 1 : responsiveColumns;
  const galleryWidth = wrapperWidth * 0.8;
  const columnWidth = galleryWidth > 0
    ? (galleryWidth - (effectiveColumns - 1) * gap) / effectiveColumns
    : 0;

  // Compute layout
  const { items, containerHeight } = useMemo(() => {
    const all = focusedId
      ? [images.find(i => i.id === focusedId), ...images.filter(i => i.id !== focusedId)]
      : [...images];
    const maxCount = focusedId ? 24 : displayCount;
    const slice = all.slice(0, maxCount);

    const colHeights = Array(effectiveColumns).fill(0);
    const placed = [];

    slice.forEach(img => {
      const aspect = img.width / img.height;
      let span = 1;
      let colIndex, y;

      if (img.id === focusedId) {
        span = 3;
        colIndex = Math.floor((effectiveColumns - span) / 2);
        y = 0;
      } else {
        colIndex = colHeights.indexOf(Math.min(...colHeights));
        if (aspect >= spanThreshold) {
          const adj = colHeights.findIndex((h,i) =>
            i < effectiveColumns - 1 && Math.abs(h - colHeights[i+1]) <= alignTolerance
          );
          if (adj !== -1) { span = 2; colIndex = adj; }
        }
        y = colHeights[colIndex];
      }

      const wPx = columnWidth * span + gap * (span - 1);
      const imgH = wPx / aspect;
      const hPx = img.id === focusedId ? imgH + INFO_PANEL_HEIGHT : imgH;

      const x = colIndex * (columnWidth + gap);
      for (let j = 0; j < span; j++) {
        colHeights[colIndex + j] = y + hPx + gap;
      }
      placed.push({ ...img, x, y, w: wPx, h: hPx });
    });

    return { items: placed, containerHeight: Math.max(...colHeights) - gap };
  }, [images, displayCount, effectiveColumns, columnWidth, gap, spanThreshold, alignTolerance, focusedId]);

  // Bar actions
  const goHistory = () => console.log('History clicked');
  const doRefresh = () => console.log('Refresh clicked');
  const doRestart = () => {
    setFocusedId(null);
    setDisplayCount(50);
    setHasLoadedMore(false);
  };

  return (
    <div ref={wrapperRef} className="gallery-wrapper">
      <div className="gallery-bar">
        <div className="bar-left">
          <button onClick={goHistory}>History</button>
          <button onClick={doRefresh}>Refresh</button>
          <button onClick={doRestart}>Restart</button>
        </div>
        <div className="bar-center">
          <select className="price-filter">
            <option>All Prices</option>
            <option>$0 - $100</option>
            <option>$100 - $500</option>
            <option>$500+</option>
          </select>
          <div className="size-filter">
            <button>S</button><button>M</button><button>L</button><button>XL</button>
          </div>
        </div>
        <div className="bar-right">
          <button className="see-filters">See All Filters ▼</button>
        </div>
      </div>
      <div className="masonry-container" style={{ position: 'relative', width: galleryWidth, height: containerHeight, margin: '0 auto' }}>
        {items.map(item => (
          <div key={item.id} className={`masonry-item${item.id === focusedId ? ' focused' : ''}`} style={{ position: 'absolute', top: item.y + GALLERY_TOP_PADDING, left: item.x, width: item.w, height: item.h, overflow: 'hidden', cursor: 'pointer', transition: 'all 100ms ease', zIndex: item.id === focusedId ? 10 : 1 }} onClick={() => setFocusedId(item.id === focusedId ? null : item.id)}>
            {item.id === focusedId ? (
              <div className="focused-wrapper" style={{ display: 'flex', height: `calc(100% - ${TOP_PADDING}px)`, boxSizing: 'border-box', padding: '20px 20px 0' }}>
                <img
                  src={item.src}
                  alt={item.alt}
                  style={{
                    width: '100%',
                    height: `calc(100% - ${INFO_PANEL_HEIGHT}px)`,
                    objectFit: 'cover',
                  }}
                />
                <div className="info-panel">
                  <div>
                    <h2>{item.alt}</h2>
                    <span>{item.width} W x {item.height} H</span>
                  </div>
                  <div>
                    <h2>{item.paintingPrice}</h2>
                  </div>
                </div>
              </div>
            ) : (
              <img src={item.src} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}
      </div>
      {!focusedId && !hasLoadedMore && <button className="load-more" onClick={() => { setHasLoadedMore(true); setDisplayCount(c => c + 30); fetchMore && fetchMore(); }}>Load More Images</button>}
      <Footer />
    </div>
  );
};

export default MasonryLayout;

/* Masonry.css */
/* same as before */
