import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/columns.css";
import "../pages/styles/Gallery.css";

const STYLE_SUBJECT_OPTIONS = [
  "Fine Art",
  "Abstract",
  "Modern",
  "Street Art",
  "Pop Art",
  "Impressionism",
  "Photorealism",
  "Portrait",
  "Landscape",
  "Nature",
  "Still Life",
  "Beach",
  "Nude",
  "Floral",
  "Animal",
];

const MEDIUM_MATERIAL_OPTIONS = [
  "Oil",
  "Watercolor",
  "Acrylic",
  "Airbrush",
  "Color",
  "Ink",
  "Latex",
];

/**
 * Your API already returns images with width/height stored.
 * We keep the same mapping you use on HomePage for consistency.
 * :contentReference[oaicite:1]{index=1}
 */
export default function Gallery({ images = null }) {
  const apiUrl = process.env.REACT_APP_API_URL || "https://localhost:5000";

  const [photos, setPhotos] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // chip filters
  const [selectedStyles, setSelectedStyles] = useState(() => new Set());
  const [selectedMediums, setSelectedMediums] = useState(() => new Set());

  // optional: sort (minimal Saatchi-like control)
  const [sortMode, setSortMode] = useState("featured"); // "featured" | "newest" | "price_asc" | "price_desc"

  useEffect(() => {
    if (Array.isArray(images)) setPhotos(images);
  }, [images]);

  const toggleChip = (setSetter, value) => {
    setSetter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedStyles(new Set());
    setSelectedMediums(new Set());
  };

  const filteredPhotos = useMemo(() => {
    const styleArr = Array.from(selectedStyles);
    const mediumArr = Array.from(selectedMediums);

    const matchesChips = (photo) => {
      // You likely store tags already; we treat tags as the matching surface.
      // - styles: matches any selected style
      // - mediums: matches any selected medium
      const tagsLower = (photo.tags || []).map((t) => String(t).toLowerCase());

      const styleOk =
        styleArr.length === 0 ||
        styleArr.some((s) => tagsLower.includes(String(s).toLowerCase()));

      const mediumOk =
        mediumArr.length === 0 ||
        mediumArr.some((m) => tagsLower.includes(String(m).toLowerCase()));

      return styleOk && mediumOk;
    };

    const list = photos.filter(matchesChips);

    // sorting
    const toNumber = (v) => {
      if (v === null || v === undefined) return NaN;
      const n = Number(String(v).replace(",", "."));
      return Number.isFinite(n) ? n : NaN;
    };

    const sorted = [...list];
    if (sortMode === "featured") {
      sorted.sort((a, b) => Number(b.__isFeatured) - Number(a.__isFeatured));
    } else if (sortMode === "newest") {
      // If you have createdAt per image, use it here.
      // Fallback: keep current order.
      sorted.sort((a, b) => 0);
    } else if (sortMode === "price_asc") {
      sorted.sort(
        (a, b) =>
          (toNumber(a.price) || Infinity) - (toNumber(b.price) || Infinity)
      );
    } else if (sortMode === "price_desc") {
      sorted.sort(
        (a, b) =>
          (toNumber(b.price) || -Infinity) - (toNumber(a.price) || -Infinity)
      );
    }

    return sorted;
  }, [photos, selectedStyles, selectedMediums, sortMode]);

  return (
    <div className="gallery-page">
      <div className="gallery-top">
        <div className="gallery-breadcrumb">All Artworks / Paintings</div>
        <h1 className="gallery-title">Original Paintings For Sale</h1>

        <div className="gallery-controls">
          <button
            type="button"
            className="gallery-filterToggle"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            {filtersOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
            <span className="gallery-filterCount">
              ({selectedStyles.size + selectedMediums.size})
            </span>
          </button>

          <div className="gallery-sort">
            <label className="gallery-sortLabel" htmlFor="gallerySort">
              Sort
            </label>
            <select
              id="gallerySort"
              className="gallery-sortSelect"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gallery-body">
        {filtersOpen && (
          <aside className="gallery-filters" aria-label="Narrow Your Results">
            <div className="filters-header">
              <div className="filters-title">Narrow Your Results</div>
              <button
                type="button"
                className="filters-clear"
                onClick={clearAllFilters}
                disabled={selectedStyles.size + selectedMediums.size === 0}
              >
                Clear
              </button>
            </div>

            <div className="filters-section">
              <div className="filters-sectionTitle">Styles &amp; Subjects</div>
              <div className="filters-chipGrid">
                {STYLE_SUBJECT_OPTIONS.map((label) => {
                  const active = selectedStyles.has(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`chip ${active ? "chip--active" : ""}`}
                      onClick={() => toggleChip(setSelectedStyles, label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filters-section">
              <div className="filters-sectionTitle">
                Mediums &amp; Materials
              </div>
              <div className="filters-chipGrid">
                {MEDIUM_MATERIAL_OPTIONS.map((label) => {
                  const active = selectedMediums.has(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`chip ${active ? "chip--active" : ""}`}
                      onClick={() => toggleChip(setSelectedMediums, label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* IMPORTANT:
                You requested removing these controls entirely, so we do NOT render them:
                - Category
                - Subject
                - Artist Country
                - Featured in
                - Ready to hang
                - Color
                - Framed
            */}
          </aside>
        )}

        <main className="gallery-grid" aria-label="Gallery results">
          <div className="gallery-resultsMeta">
            <span className="gallery-resultsCount">
              {filteredPhotos.length} works
            </span>
          </div>

          <PhotoAlbum
            layout="columns"
            photos={filteredPhotos}
            targetColumnWidth={320}
            spacing={12}
            padding={0}
            render={{
              photo: ({ photo, imageProps }) => {
                // Defensive: in some edge cases `photo` can be undefined.
                if (!imageProps) return null;

                const safeAlt = imageProps.alt ?? photo?.alt ?? "";

                return (
                  <div className="ga-card">
                    <img {...imageProps} alt={safeAlt} className="ga-img" />
                    <div className="ga-overlay">
                      <div className="ga-artist">
                        {photo?.artistName || safeAlt}
                      </div>
                      {photo?.price !== undefined &&
                        photo?.price !== null &&
                        String(photo.price).trim() !== "" && (
                          <div className="ga-price">{String(photo.price)}</div>
                        )}
                    </div>
                  </div>
                );
              },
            }}
          />
        </main>
      </div>

      {/* IMPORTANT:
          You requested removing the “text block between gallery and footer” (Saatchi SEO content).
          We intentionally render nothing here.
      */}
    </div>
  );
}
