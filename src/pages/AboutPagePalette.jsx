import React, { useState, useEffect } from "react";
import "./styles/AboutPage.css";

const spotsData = [
  {
    id: 1,
    label: "About Us",
    top: "30%",
    left: "35%",
    size: "150px",
    color: "#c96567",
  },
  {
    id: 2,
    label: "Our History",
    top: "48%",
    left: "28%",
    size: "120px",
    color: "#6a8d6e",
  },
  {
    id: 3,
    label: "Team",
    top: "70%",
    left: "38%",
    size: "180px",
    color: "#5998b3",
  },
];

export default function AboutPage() {
  const [expandedSpotId, setExpandedSpotId] = useState(null);
  const [closingSpotId, setClosingSpotId] = useState(null);
  const [showText, setShowText] = useState(false);
  const [labelVisibility, setLabelVisibility] = useState(() => {
    return spotsData.reduce((acc, spot) => ({ ...acc, [spot.id]: true }), {});
  });

  const expandedSpot = spotsData.find((spot) => spot.id === expandedSpotId);
  const closingSpot = spotsData.find((spot) => spot.id === closingSpotId);

  const handleClose = () => {
    setClosingSpotId(expandedSpotId);
    setExpandedSpotId(null);
  };

  // --- State Check ---
  const isAnySpotActive = expandedSpotId !== null || closingSpotId !== null;

  // --- EFFECT 1: Control Text Fade-in/out ---
  useEffect(() => {
    if (expandedSpotId) {
      setShowText(false);
      const t = setTimeout(() => setShowText(true), 700);
      return () => clearTimeout(t);
    } else {
      setShowText(false);
    }
  }, [expandedSpotId]);

  // --- EFFECT 2: Control Label Visibility ---
  useEffect(() => {
    if (expandedSpotId) {
      setLabelVisibility((prev) => ({ ...prev, [expandedSpotId]: false }));
    } else {
      if (closingSpotId) {
        const t = setTimeout(() => {
          setLabelVisibility((prev) => ({ ...prev, [closingSpotId]: true }));
        }, 1000);
        return () => clearTimeout(t);
      }
    }
  }, [expandedSpotId, closingSpotId]);

  // --- EFFECT 3: Clear Closing Spot Data (after shrink animation finishes) ---
  useEffect(() => {
    if (closingSpotId) {
      const t = setTimeout(() => {
        setClosingSpotId(null);
      }, 1000); // Wait for 1s (shrink duration)
      return () => clearTimeout(t);
    }
  }, [closingSpotId]);

  return (
    <main className="about-page">
      {/* 💡 RENDER ALL spots ALWAYS for Z-index control */}
      {spotsData.map((spot) => (
        <div
          key={spot.id}
          className="palette-spot"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.size,
            height: spot.size,
            background: spot.color,
            // 💡 NEW Z-INDEX LOGIC: Lower z-index during active animation (expand/shrink)
            zIndex: isAnySpotActive ? 1 : 20,
          }}
          onClick={() => setExpandedSpotId(spot.id)}
        >
          <span
            className={`spot-label ${
              labelVisibility[spot.id] ? "visible" : "hidden"
            }`}
          >
            {spot.label}
          </span>
        </div>
      ))}

      <div
        className={`expand-mask ${isAnySpotActive ? "visible" : ""}`}
        onClick={() => expandedSpotId && handleClose()}
      >
        <div
          className={`expanding-circle ${expandedSpotId ? "grow" : ""}`}
          style={
            expandedSpot || closingSpot
              ? {
                  top: `calc(${(expandedSpot || closingSpot).top} - 8%)`,
                  left: `calc(${(expandedSpot || closingSpot).left} - 5.4%)`,
                  width: (expandedSpot || closingSpot).size,
                  height: (expandedSpot || closingSpot).size,
                  background: (expandedSpot || closingSpot).color,
                }
              : {}
          }
        ></div>

        <div className={`about-text ${showText ? "visible" : ""}`}>
          <h2>{expandedSpot ? expandedSpot.label : ""}</h2>
          <p>
            This content fades in after the area fills. This is the content for:
            **{expandedSpot ? expandedSpot.label : "Select a spot"}**.
          </p>
        </div>
      </div>

      <img className="paleta" src="/images/paleta-1.png" alt="palette" />
    </main>
  );
}
