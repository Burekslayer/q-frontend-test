import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useHoverAnimation from "../hooks/useHoverAnimation";
import Autumn from "../components/seasons/Autumn";
import Winter from "../components/seasons/Winter";
import WinterNight from "../components/seasons/WinterNight";
import AutumnNight from "../components/seasons/AutumnNight";
import PreloaderOverlay from "../components/PreLoader";
import MasonryLayout from "../components/Masonry";

import "./styles/HomePage.css";
import "./styles/Masonry.css";

function getSeasonByDate(date = new Date()) {
  const month = date.getMonth() + 1; // JS months are 0-based

  if (month >= 3 && month < 6) return "spring"; // Mar–May
  if (month >= 6 && month < 9) return "summer"; // Jun–Aug
  if (month >= 9 && month < 12) return "autumn"; // Sep–Nov
  return "winter"; // Dec–Feb
}

const SeasonDayMap = {
  winter: Winter,
  autumn: Autumn,
};

const SeasonNightMap = {
  winter: WinterNight,
  autumn: AutumnNight,
};

function HomePage() {
  const galleryRef = useRef(null);
  const audioRef = useRef(null);

  const navigate = useNavigate();

  const easelHover = useHoverAnimation();
  const pictureHover = useHoverAnimation();
  const brushesHover = useHoverAnimation();
  const lupaHover = useHoverAnimation();
  const lusterHover = useHoverAnimation();

  const [galleryPhase, setGalleryPhase] = useState("visible");
  const [showNav, setShowNav] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [dayReady, setDayReady] = useState(false);
  const [nightReady, setNightReady] = useState(false);

  /* --------- TEST ----------*/

  const [seasonTest, setSeasonTest] = useState("winter"); // "winter" | "autumn"


  /* --------- TEST ----------*/

  const apiUrl = process.env.REACT_APP_API_URL || "https://localhost:5000";

  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);

  const effectiveSeason = seasonTest || getSeasonByDate();

  const DayComp = SeasonDayMap[effectiveSeason];
  const NightComp = SeasonNightMap[effectiveSeason];
  const dayLayerRef = useRef(null);
  const nightLayerRef = useRef(null);

  const handleThemeToggle = () => {
    setIsDarkTheme((v) => !v);
  };

  useEffect(() => {
    const pauseVideos = (root) => {
      root?.querySelectorAll("video").forEach((v) => {
        try {
          v.pause();
        } catch {}
      });
    };
    const playVideos = (root) => {
      root?.querySelectorAll("video").forEach((v) => {
        try {
          v.play();
        } catch {}
      });
    };

    if (isDarkTheme) {
      pauseVideos(dayLayerRef.current);
      playVideos(nightLayerRef.current);
    } else {
      pauseVideos(nightLayerRef.current);
      playVideos(dayLayerRef.current);
    }
  }, [isDarkTheme]);

  useEffect(() => {
    setDayReady(false);
    setNightReady(false);
    setIsLoading(true);
  }, [effectiveSeason]);

  useEffect(() => {
    if (dayReady && nightReady) setIsLoading(false);
  }, [dayReady, nightReady]);


  useEffect(() => {
    const timers = [
      /* setTimeout(() => setActive1(false), 1000), */
      setTimeout(() => setActive1(false), 1500),
      setTimeout(() => setActive2(true), 200),
      setTimeout(() => setActive2(false), 1700),
      setTimeout(() => setActive3(true), 400),
      setTimeout(() => setActive3(false), 1900),
      setTimeout(() => setActive4(true), 600),
      setTimeout(() => setActive4(false), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Fetch Gallery Images (+ Featured)
  useEffect(() => {
    const currentHour = new Date().getUTCHours();
    const rotationIndex = currentHour % 3;

    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/all`);
        const users = response.data;
        const featured = [];
        const nonFeatured = [];

        users.forEach((user) => {
          const gallery = user.gallery || [];

          const findClosestImportant = (gallery, rotationIndex) => {
            for (let i = rotationIndex; i >= 0; i--) {
              const match = gallery.find((img) => img.importantIndex === i);
              if (match) return match;
            }
            return null;
          };

          const important = findClosestImportant(gallery, rotationIndex);
          if (important)
            featured.push({
              ...important,
              artistName: `${user.firstName} ${user.lastName}`,
            });

          gallery.forEach((img) => {
            if (img !== important) {
              nonFeatured.push({
                ...img,
                artistName: `${user.firstName} ${user.lastName}`,
              });
            }
          });
        });

        for (let i = nonFeatured.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonFeatured[i], nonFeatured[j]] = [nonFeatured[j], nonFeatured[i]];
        }

        const allPhotos = [...featured, ...nonFeatured].map((img) => ({
          id: img._id,
          src: img.url,
          width: img.width,
          height: img.height,
          alt: img.artistName,
          price: img.price,
          tags: img.tags,
          averageHue: img.averageHue,
        }));
        setPhotos(allPhotos);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      }
    };

    fetchGallery();
  }, [apiUrl]);

  const handleBrushesClick = () => {
    navigate("/login");
  };
  const handlePictureClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    navigate("/about");
  };
  const handleLupaClick = () => {
    navigate("/search");
  };
  const handleLusterClick = () => {
    handleThemeToggle();
  };
  const handleEaselClick = () => {
    window.scrollTo({ top: window.innerWidth * (5 / 9), behavior: "smooth" });
  };
  const handleReturnHome = () => {
    if (galleryRef.current) {
      const currentTop = galleryRef.current.getBoundingClientRect().top;
      galleryRef.current.style.top = `${currentTop}px`;
    }
    setGalleryPhase("disintegrate");
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      setGalleryPhase("reset");
      setTimeout(() => {
        setGalleryPhase("visible");
        if (galleryRef.current) {
          galleryRef.current.style.top = "";
        }
      }, 10);
    }, 500);
  };

  // Start the gallery container from the bottom of the screen
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth * (5 / 9);
      if (window.scrollY > threshold) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const seasonProps = {
    active1,
    active2,
    active3,
    active4,
    easelHover,
    brushesHover,
    pictureHover,
    lupaHover,
    lusterHover,
    handleEaselClick,
    handleBrushesClick,
    handlePictureClick,
    handleLupaClick,
    audioRef,
    handleLusterClick,
  };
  return (
    <div className="home-page">
      <PreloaderOverlay isVisible={isLoading} />

      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 450ms ease",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setSeasonTest((s) => (s === "winter" ? "autumn" : "winter"))
          }
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 10000,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Switch Season (now: {seasonTest})
        </button>
        <div className="home-fixed">
          <div
            className={`hover-label galerija-label ${
              easelHover.isHovered ? "visible" : ""
            }`}
          >
            Galerija
          </div>
          <div
            className={`hover-label brushes-label ${
              brushesHover.isHovered ? "visible" : ""
            }`}
          >
            Prijava
          </div>

          <div
            className={`hover-label lupa-label ${
              lupaHover.isHovered ? "visible" : ""
            }`}
          >
            Pretraga
          </div>

          <div
            className={`hover-label picture-label ${
              pictureHover.isHovered ? "visible" : ""
            }`}
          >
            O nama
          </div>

          <div className="season-pair">
            {/* DAY layer */}
            <div
              ref={dayLayerRef}
              className={`season-layer ${isDarkTheme ? "hidden" : "shown"}`}
            >
              {DayComp && (
                <DayComp {...seasonProps} onReady={() => setDayReady(true)} />
              )}
            </div>

            {/* NIGHT layer */}
            <div
              ref={nightLayerRef}
              className={`season-layer ${isDarkTheme ? "shown" : "hidden"}`}
            >
              {NightComp && (
                <NightComp
                  {...seasonProps}
                  onReady={() => setNightReady(true)}
                />
              )}
            </div>

            {isLoading && <PreloaderOverlay />}
          </div>
        </div>
      </div>
      {/* Gallery content section that appears below the fixed images */}

      <div
        ref={galleryRef}
        className={`gallery ${galleryPhase}`}
        style={{ position: "relative", zIndex: 10 }}
      >
        <MasonryLayout images={photos} />
      </div>

      {/* Navigation Bar with a button to return home */}
      {showNav && (
        <nav className="nav-bar">
          <button onClick={handleReturnHome}>Return to Home</button>
        </nav>
      )}
    </div>
  );
}
export default HomePage;
