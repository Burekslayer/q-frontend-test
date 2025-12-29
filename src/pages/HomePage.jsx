import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useHoverAnimation from "../hooks/useHoverAnimation";
import Autumn from "../components/seasons/autumn";
import Winter from "../components/seasons/winter";
import Spring from "../components/seasons/spring";
import Summer from "../components/seasons/summer";
import PreloaderOverlay from "../components/PreLoader";

import {
  GallerySvg,
  LoginSvg,
  SearchSvg,
  AboutSvg,
} from "../components/SvgIcons";

import MasonryLayout from "../components/Masonry";

import "./styles/HomePage.css";
import "./styles/Masonry.css";

const SEASON_COMPONENTS = {
  spring: Spring,
  summer: Summer,
  autumn: Autumn,
  winter: Winter,
};

function getSeasonByDate(date = new Date()) {
  const month = date.getMonth() + 1; // JS months are 0-based

  if (month >= 3 && month < 6) return "spring"; // Mar–May
  if (month >= 6 && month < 9) return "summer"; // Jun–Aug
  if (month >= 9 && month < 12) return "autumn"; // Sep–Nov
  return "winter"; // Dec–Feb
}

function HomePage() {
  const gallerySvgRef = useRef(null);
  const aboutSvgRef = useRef(null);
  const loginSvgRef = useRef(null);
  const searchSvgRef = useRef(null);
  const galleryRef = useRef(null);
  const audioRef = useRef(null);

  const navigate = useNavigate();

  const easelHover = useHoverAnimation();
  const pictureHover = useHoverAnimation();
  const brushesHover = useHoverAnimation();
  const lupaHover = useHoverAnimation();

  const [galleryPhase, setGalleryPhase] = useState("visible");
  const [showNav, setShowNav] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || "https://localhost:5000";

  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);

  const season = getSeasonByDate();
  const SeasonComponent = SEASON_COMPONENTS[season];

  useEffect(() => {
    setIsLoading(true);
  }, [season]);

  const handleSeasonReady = () => {
    // small delay prevents flashing if it loads instantly
    setTimeout(() => setIsLoading(false), 150);
  };

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

  // SVG animations ref
  useEffect(() => {
    const initPaths = (svgElement) => {
      if (!svgElement) return;
      const paths = svgElement.querySelectorAll("path");
      paths.forEach((path) => {
        const length = path.getTotalLength();

        // Use a fixed value (e.g., 2) as a safety margin
        const safetyOffset = length;

        path.style.strokeDasharray = length;
        // **FIX:** Set the initial offset larger than the length to guarantee it's hidden.
        path.style.strokeDashoffset = safetyOffset;

        // Optional: If you use the CSS variable in your animation, update it too
        path.style.setProperty("--dash-length", safetyOffset);
      });
    };
    // ... rest of your code ...
    const svgRefs = [
      gallerySvgRef.current,
      aboutSvgRef.current,
      loginSvgRef.current,
      searchSvgRef.current,
    ];
    svgRefs.forEach(initPaths);
  }, []);

  return (
    <div className="home-page">
      <PreloaderOverlay isVisible={isLoading} />

      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 450ms ease",
        }}
      >
        <div className="home-fixed">
          <GallerySvg
            ref={gallerySvgRef}
            animationState={easelHover.animationState}
          />
          <LoginSvg
            ref={loginSvgRef}
            animationState={brushesHover.animationState}
          />
          <SearchSvg
            ref={searchSvgRef}
            animationState={lupaHover.animationState}
          />
          <AboutSvg
            ref={aboutSvgRef}
            animationState={pictureHover.animationState}
          />

          <SeasonComponent
            active1={active1}
            active2={active2}
            active3={active3}
            active4={active4}
            easelHover={easelHover}
            brushesHover={brushesHover}
            pictureHover={pictureHover}
            lupaHover={lupaHover}
            handleEaselClick={handleEaselClick}
            handleBrushesClick={handleBrushesClick}
            handlePictureClick={handlePictureClick}
            handleLupaClick={handleLupaClick}
            audioRef={audioRef}
            onReady={handleSeasonReady}
          />
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
