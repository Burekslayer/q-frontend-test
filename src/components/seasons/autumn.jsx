import { useEffect, useRef, useState } from "react";

export default function Autumn({
  active1,
  active2,
  active3,
  active4,
  easelHover,
  brushesHover,
  pictureHover,
  lupaHover,
  handleEaselClick,
  handleBrushesClick,
  handlePictureClick,
  handleLupaClick,
  audioRef,
  onReady,
}) {
  const bgLoaded = useRef(false);
  const videoLoaded = useRef(false);

  const tryReady = () => {
    if (bgLoaded.current && videoLoaded.current) {
      onReady?.();
    }
  };

  return (
    <div className="background-parent">
      {/* Base studio image */}
      <img
        className="background"
        src="/images/jesen/art_room_comp.webp"
        alt="Studio Background"
        onLoad={() => {
          bgLoaded.current = true;
          tryReady();
        }}
      />
      <video
        className="fire"
        autoPlay
        muted
        loop
        preload="auto"
        onLoadedData={() => {
          videoLoaded.current = true;
          tryReady();
        }}
      >
        <source src="/images/jesen/art_room_fire.webm" type="video/webm" />
      </video>
      <video className="landscape" autoPlay muted loop preload="auto">
        <source src="/images/jesen/art_room_outside.webm" type="video/webm" />
      </video>
      <video className="light-rays" autoPlay muted loop preload="auto">
        <source src="/images/jesen/Light_Rays_1.webm" type="video/webm" />
      </video>
      {/* Easel image */}

      <img
        className={`easel${active1 ? " active1" : ""}`}
        src="/images/jesen/gallery.webp"
        alt="Easel"
        onMouseEnter={easelHover.handleMouseEnter}
        onMouseLeave={easelHover.handleMouseLeave}
        onClick={handleEaselClick}
      />
      {/* Brushes image */}
      <img
        className={`brushes${active2 ? " active2" : ""}`}
        src="/images/jesen/brushes.webp"
        alt="Brushes"
        onClick={handleBrushesClick}
        onMouseEnter={brushesHover.handleMouseEnter}
        onMouseLeave={brushesHover.handleMouseLeave}
      />
      <audio ref={audioRef} src="/recordings/oNama.wav" />
      {/* Picture image lel */}
      <img
        className={`picture${active4 ? " active4" : ""}`}
        src="/images/jesen/picture.webp"
        alt="slicka"
        style={{ cursor: "pointer" }}
        onMouseEnter={pictureHover.handleMouseEnter}
        onMouseLeave={pictureHover.handleMouseLeave}
        onClick={handlePictureClick}
      />

      {/* Lupa image */}
      <img
        className={`lupa${active3 ? " active3" : ""}`}
        src="/images/jesen/search.webp"
        alt="Lupa"
        style={{ cursor: "pointer" }}
        onMouseEnter={lupaHover.handleMouseEnter}
        onMouseLeave={lupaHover.handleMouseLeave}
        onClick={handleLupaClick}
      />
    </div>
  );
}
