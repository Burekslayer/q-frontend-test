import React, { useEffect, useMemo, useState } from "react";
import "../pages/styles/Gallery.css";

const STYLE_OPTIONS = [
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
  "Floral",
  "Animal",
];

const MEDIUM_OPTIONS = ["Oil", "Watercolor", "Acrylic", "Ink", "Mixed Media"];

// Saatchi-like page size options
const PER_PAGE_OPTIONS = [30, 60, 100];

function splitIntoColumns(items, columns) {
  const cols = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item)); // round-robin (Saatchi-like)
  return cols;
}

// Build a compact pagination model: 1 2 3 4 5 … last (with current centered)
function getPageModel(current, total) {
  if (total <= 1) return [1];

  const clamp = (n) => Math.max(1, Math.min(total, n));
  const c = clamp(current);

  // If few pages, show all
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

  // Saatchi-like: show first, last, and a sliding window around current
  const windowSize = 5; // number of numeric buttons in the middle window
  const half = Math.floor(windowSize / 2);

  let start = c - half;
  let end = c + half;

  // Keep window inside [2, total-1]
  if (start < 2) {
    start = 2;
    end = start + windowSize - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = end - windowSize + 1;
  }

  const pages = [1];

  if (start > 2) pages.push("…");

  for (let p = start; p <= end; p++) pages.push(p);

  if (end < total - 1) pages.push("…");

  pages.push(total);

  return pages;
}

export default function Gallery({ images = [] }) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Responsive breakpoint like Saatchi (1440px)
  const [isWide1440, setIsWide1440] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1440px)").matches
      : true
  );

  const [isMobile980, setIsMobile980] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 980px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 980px)");
    const onChange = (e) => setIsMobile980(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1440px)");
    const onChange = (e) => setIsWide1440(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Accordion open/close
  const [openSections, setOpenSections] = useState({
    style: true,
    medium: true,
  });
  const toggleSection = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  // Filters state
  const [selectedStyles, setSelectedStyles] = useState(() => new Set());
  const [selectedMediums, setSelectedMediums] = useState(() => new Set());

  const toggleSet = (setter, value) => {
    setter((prev) => {
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

  const activeFilterCount = selectedStyles.size + selectedMediums.size;

  // Pagination state
  const [perPage, setPerPage] = useState(30);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = Array.isArray(images) ? images : [];

    const styleArr = Array.from(selectedStyles).map((s) => s.toLowerCase());
    const mediumArr = Array.from(selectedMediums).map((m) => m.toLowerCase());

    const matches = (img) => {
      const tagsLower = (img.tags || []).map((t) => String(t).toLowerCase());

      const styleOk =
        styleArr.length === 0 || styleArr.some((s) => tagsLower.includes(s));

      const mediumOk =
        mediumArr.length === 0 || mediumArr.some((m) => tagsLower.includes(m));

      return styleOk && mediumOk;
    };

    return list.filter(matches);
  }, [images, selectedStyles, selectedMediums]);

  // Reset pagination when filters or per-page changes
  useEffect(() => {
    setPage(1);
  }, [selectedStyles, selectedMediums, perPage]);

  const totalResults = filtered.length;

  const totalPages = useMemo(() => {
    const tp = Math.ceil(totalResults / perPage);
    return Math.max(1, tp);
  }, [totalResults, perPage]);

  // Clamp page if totalPages shrinks (defensive)
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const startIndex = (page - 1) * perPage;

  const paged = useMemo(() => {
    return filtered.slice(startIndex, startIndex + perPage);
  }, [filtered, startIndex, perPage]);

  // Saatchi rules:
  // filters open: 3 cols >=1440, else 2
  // filters closed: 4 cols >=1440, else 3
  const columnCount = useMemo(() => {
    // Mobile rule: always 2 columns, whether filters are open or not
    if (isMobile980) return 2;

    // Desktop/tablet rule (Saatchi-like)
    if (filtersOpen) return isWide1440 ? 3 : 2;
    return isWide1440 ? 4 : 3;
  }, [filtersOpen, isWide1440, isMobile980]);

  const pagedWithKeys = useMemo(() => {
    return paged.map((p, i) => ({
      ...p,
      __key:
        String(p._id ?? p.id ?? p.src ?? "img") + "-" + String(startIndex + i),
    }));
  }, [paged, startIndex]);

  const columns = useMemo(
    () => splitIntoColumns(pagedWithKeys, columnCount),
    [pagedWithKeys, columnCount]
  );

  const pageModel = useMemo(
    () => getPageModel(page, totalPages),
    [page, totalPages]
  );

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);

    // Optional: scroll user to top of results (Saatchi-like behavior)
    // Adjust selector to your page if needed
    const el = document.querySelector(".sg-resultsMeta");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sg-page">
      <div className="sg-top">
        <div className="sg-breadcrumb">All Artworks / Paintings</div>
        <h1 className="sg-title">Original Paintings For Sale</h1>

        <div className="sg-controls">
          <button
            type="button"
            className="sg-filterToggle"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            {filtersOpen ? "HIDE FILTERS" : "FILTERS"} ({activeFilterCount})
          </button>
        </div>
      </div>

      <div className={`sg-body ${filtersOpen ? "" : "sg-body--noFilters"}`}>
        {filtersOpen && (
          <aside className="sg-filters" aria-label="Narrow Your Results">
            <div className="sg-filtersHeader">
              <div className="sg-filtersTitle">Narrow Your Results</div>

              <button
                type="button"
                className="sg-clear"
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                Clear
              </button>
            </div>

            {/* STYLE */}
            <section className="sg-section">
              <button
                type="button"
                className="sg-sectionHead"
                onClick={() => toggleSection("style")}
                aria-expanded={openSections.style}
              >
                <span className="sg-sectionTitle">STYLE</span>
                <span className="sg-sectionChevron" aria-hidden>
                  {openSections.style ? "▾" : "▸"}
                </span>
              </button>

              {openSections.style && (
                <div className="sg-sectionBody">
                  {STYLE_OPTIONS.map((label) => (
                    <label key={label} className="sg-checkRow">
                      <input
                        type="checkbox"
                        checked={selectedStyles.has(label)}
                        onChange={() => toggleSet(setSelectedStyles, label)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>

            {/* MEDIUMS */}
            <section className="sg-section">
              <button
                type="button"
                className="sg-sectionHead"
                onClick={() => toggleSection("medium")}
                aria-expanded={openSections.medium}
              >
                <span className="sg-sectionTitle">MEDIUMS &amp; MATERIALS</span>
                <span className="sg-sectionChevron" aria-hidden>
                  {openSections.medium ? "▾" : "▸"}
                </span>
              </button>

              {openSections.medium && (
                <div className="sg-sectionBody">
                  {MEDIUM_OPTIONS.map((label) => (
                    <label key={label} className="sg-checkRow">
                      <input
                        type="checkbox"
                        checked={selectedMediums.has(label)}
                        onChange={() => toggleSet(setSelectedMediums, label)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          </aside>
        )}

        <main className="sg-results" aria-label="Gallery results">
          <div className="sg-resultsMeta">{totalResults} works</div>

          {/* True Saatchi-style: render actual columns, each stacks vertically */}
          <div
            className={`sg-polaroidColumns ${
              filtersOpen ? "isFiltersOpen" : "isFiltersClosed"
            }`}
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {columns.map((col, colIndex) => (
              <div className="sg-polaroidCol" key={colIndex}>
                {col.map((p) => (
                  <figure key={p.__key} className="sg-polaroid">
                    <div className="sg-imageWrap">
                      <img
                        className="sg-img"
                        src={p.src}
                        alt={p.alt || p.artistName || ""}
                        loading="lazy"
                      />
                    </div>

                    <figcaption className="sg-meta">
                      {p.price !== undefined &&
                        p.price !== null &&
                        String(p.price).trim() !== "" && (
                          <div className="sg-metaPrice">{String(p.price)}</div>
                        )}

                      <div className="sg-metaTitle">
                        {p.title || "Untitled"}
                      </div>

                      {p.artistName && (
                        <div className="sg-metaArtist">{p.artistName}</div>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div className="sg-paginationBar" aria-label="Pagination controls">
            <div className="sg-pagination">
              <button
                type="button"
                className="sg-pageNav"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                ‹
              </button>

              <div className="sg-pageNums" role="navigation" aria-label="Pages">
                {pageModel.map((item, idx) => {
                  if (item === "…") {
                    return (
                      <span key={`dots-${idx}`} className="sg-dots" aria-hidden>
                        …
                      </span>
                    );
                  }

                  const n = item;
                  const isActive = n === page;

                  return (
                    <button
                      key={n}
                      type="button"
                      className={`sg-pageNum ${isActive ? "isActive" : ""}`}
                      onClick={() => goToPage(n)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="sg-pageNav"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>

            <div className="sg-perPage">
              <label className="sg-perPageLabel" htmlFor="sg-perPageSelect">
                Results Per Page
              </label>
              <select
                id="sg-perPageSelect"
                className="sg-perPageSelect"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} Results Per Page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
