import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHoverAnimation from '../hooks/useHoverAnimation';
import { fetchPhotos } from '../data/photos';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { GallerySvg, LoginSvg, SearchSvg, AboutSvg } from '../components/SvgIcons';
import useHoverTooltip from "../hooks/useHoverTooltip";

import './HomePage.css';
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import 'yet-another-react-lightbox/styles.css';


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
    const [photos, setPhotos] = useState([]);
    const [showAllRows, setShowAllRows] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    
    const { tooltip, handleMouseMove, handleMouseLeave } = useHoverTooltip();

    const collapseRef = showAllRows ? "expanded" : "collapsed";
    const collapsedRowCount = 3;

    useEffect(() => {
        async function loadPhotos() {
          const photosData = await fetchPhotos();
          setPhotos(photosData);
        }
        loadPhotos();
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
            <div ref={galleryRef} className={`gallery ${galleryPhase}`}
            style={{ position: "relative", zIndex: lightboxIndex >= 0 ? 1 : 20 }}
            >
                <PhotoAlbum
                    photos={photos}
                    layout="rows"
                    targetRowHeight={300}
                    spacing={0}
                    margin={0}
                    componentsProps={{ container: { className: collapseRef } }}
                    render={{
                        extras: (props, { photo, index, width, height }) => {
                            return (
                                <div
                                    className=''
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        // pointerEvents: 'none' would prevent mouse events;
                                        // instead we set it to auto so we can capture them.
                                        pointerEvents: 'auto',
                                    }}
                                    onMouseMove={(e) => handleMouseMove(e, `${photo.paintingPrice || '500.00'}`)}
                                    onMouseLeave={handleMouseLeave}
                                />
                          );
                        },
                      }}
                    onClick={({ index }) => setLightboxIndex(index)}
                />


                {tooltip.visible && (
                    <div
                        style={{
                            position: 'fixed',
                            top: tooltip.y,
                            left: tooltip.x,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            pointerEvents: 'none',
                            zIndex: 4,
                        }}
                    >
                        {tooltip.content}
                    </div>
                )}


                <div className="gallery-toggle">
                    {showAllRows ? (
                        <button onClick={() => setShowAllRows(false)}>Show Less</button>
                    ) : (
                        <button onClick={() => setShowAllRows(true)}>Show More</button>
                    )}
                </div>
                {/* Inline styles to control row visibility */}
                <style>
                    {`
                        .collapsed .react-photo-album--track:nth-child(n + ${
                          collapsedRowCount + 1
                        }) {
                          display: none;
                        }
                        .expanded .react-photo-album--track {
                          display: flex;
                        }
                    `}
                </style>    
            </div> 
            

            <Lightbox
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={photos.map((photo) => ({ src: photo.src, alt: photo.alt, paintingPrice: photo.paintingPrice }))}
                plugins={[Thumbnails]}
                toolbar={{
                    buttons: [
                        <button
                            key="artist-profile"
                            type="button"
                            className="yarl__button"
                            onClick={() => alert("Go to artist profile!")}
                        >
                            {lightboxIndex >= 0 && photos[lightboxIndex] ? photos[lightboxIndex].alt : "Artist Profile"}
                        </button>,
                        <span key="price" className="yarl__price">
                            {lightboxIndex >= 0 && photos[lightboxIndex] ? photos[lightboxIndex].paintingPrice : "Artist Profile"}
                        </span>,
                        <button
                            key="add-to-cart"
                            type="button"
                            className="yarl__button"
                            onClick={() => alert("Added to cart!")}
                        >
                            Add to Cart
                        </button>,
                        "close",
                    ],
                }}
                
                on={{
                    view: ({ index }) => setLightboxIndex(index), // Sync index when slide changes
                }}
                controller={{ closeOnBackdropClick: true, closeOnPullUp: true, closeOnPullDown: true }}
            />
            
            

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
