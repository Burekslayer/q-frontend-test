import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHoverAnimation from '../hooks/useHoverAnimation';
import { GallerySvg, LoginSvg, SearchSvg, AboutSvg } from '../components/SvgIcons';
import { fetchPhotos } from '../data/photos'
import MasonryLayout from '../components/Masonry';

import './styles/HomePage.css';
import './styles/Masonry.css'


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
    const chairHover = useHoverAnimation();
    const thingsHover = useHoverAnimation();

    const [galleryPhase, setGalleryPhase] = useState("visible");
    const [showNav, setShowNav] = useState(false);
    const [apiPhotos, setApiPhotos] = useState([]);

    // Load once on mount
    useEffect(() => {
      (async () => {
        const pics = await fetchPhotos();
        setApiPhotos(pics);
      })();
    }, []);


    const handleChairClick = () =>  {
        navigate('/login');
    };
    const handlePictureClick = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    const handleThingsClick = () => {
        navigate('/search');
    }
    const handleEaselClick = () => {
        window.scrollTo({ top: window.innerWidth * (5 / 9), behavior: "smooth" });
    }
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
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.setProperty('--dash-length', length);
            });
        };
        const svgRefs = [gallerySvgRef.current, aboutSvgRef.current, loginSvgRef.current, searchSvgRef.current];
        svgRefs.forEach(initPaths);
    }, []);

    return (
        <div className="home-page" >
            <div className='home-fixed'>
                <GallerySvg ref={gallerySvgRef} animationState={easelHover.animationState} />
                <LoginSvg ref={loginSvgRef} animationState={chairHover.animationState} />
                <SearchSvg ref={searchSvgRef} animationState={thingsHover.animationState} />
                <AboutSvg ref={aboutSvgRef} animationState={pictureHover.animationState} />
                {/* Base studio image */}
                <img 
                    className="background" 
                    src="/images/atelje.jpg" 
                    alt="Studio Background" 
                />
                {/* Easel image */}
                <img 
                    className="easel" 
                    src="/images/stafelaj.png" 
                    alt="Easel"
                    onMouseEnter={easelHover.handleMouseEnter}
                    onMouseLeave={easelHover.handleMouseLeave} 
                    onClick={handleEaselClick}
                />
                {/* Chair image */}             
                <img
                    className="chair"
                    src="/images/stolica.png"
                    alt="Chair"
                    onClick={handleChairClick}
                    onMouseEnter={chairHover.handleMouseEnter}
                    onMouseLeave={chairHover.handleMouseLeave}
                />
                <audio ref={audioRef} src="/recordings/oNama.wav" />
                {/* Picture image lel */}
                <img
                    className="picture"
                    src="/images/slika.png"
                    alt="slicka"
                    style={{ cursor: "pointer" }} 
                    onMouseEnter={pictureHover.handleMouseEnter}
                    onMouseLeave={pictureHover.handleMouseLeave}
                    onClick={handlePictureClick}
                />

                { /* Things image */ }
                <img
                    className='things'
                    src="/images/stvari.png"
                    alt="things"
                    style={{cursor: "pointer"}}
                    onMouseEnter={thingsHover.handleMouseEnter}
                    onMouseLeave={thingsHover.handleMouseLeave}
                    onClick={handleThingsClick}
                />
            </div>

            {/* Gallery content section that appears below the fixed images */}

            <div ref={galleryRef} className={`gallery ${galleryPhase}`} style={{ position: "relative", zIndex: 10 }}>
                <MasonryLayout images={apiPhotos} />  
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
