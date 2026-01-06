import { useRef } from "react";
export default function Spring({
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
  onReady,
  handleLusterClick,
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
        src="/images/prolece/dan/Art_Studio_Spring_Composition.webp"
        alt="Studio Background"
        onLoad={() => {
          bgLoaded.current = true;
          tryReady();
        }}
      />
      <img
        className="outside"
        src="/images/prolece/dan/Art_Studio_Spring_Background.webp"
        alt="Studio Background"
      />

      <video
        className="fire-prolece"
        autoPlay
        muted
        loop
        preload="auto"
        onLoadedData={() => {
          videoLoaded.current = true;
          tryReady();
        }}
      >
        <source
          src="/images/prolece/dan/Smoke.webm"
          type="video/webm"
        />
      </video>
      <video
        className="landscape"
        autoPlay
        muted
        loop
        preload="auto"
        onLoadedData={() => {
          videoLoaded.current = true;
          tryReady();
        }}
      >
        <source src="/images/prolece/dan/Spring_Rain.webm" type="video/webm" />
      </video>
      {/* Easel image */}

      <img
        className={`easel${active1 ? " active1" : ""}`}
        src="/images/prolece/dan/easel.webp"
        alt="Easel"
        onMouseEnter={easelHover.handleMouseEnter}
        onMouseLeave={easelHover.handleMouseLeave}
        onClick={handleEaselClick}
      />
      {/* Brushes image */}
      <img
        className={`brushes${active2 ? " active2" : ""}`}
        src="/images/prolece/dan/brushes.webp"
        alt="Brushes"
        onClick={handleBrushesClick}
        onMouseEnter={brushesHover.handleMouseEnter}
        onMouseLeave={brushesHover.handleMouseLeave}
      />
      <audio ref={audioRef} src="/recordings/oNama.wav" />
      {/* Picture image lel */}
      <img
        className={`picture${active4 ? " active4" : ""}`}
        src="/images/prolece/dan/picture.webp"
        alt="slicka"
        style={{ cursor: "pointer" }}
        onMouseEnter={pictureHover.handleMouseEnter}
        onMouseLeave={pictureHover.handleMouseLeave}
        onClick={handlePictureClick}
      />

      {/* Lupa image */}
      <img
        className={`lupa${active3 ? " active3" : ""}`}
        src="/images/prolece/dan/search.webp"
        alt="Lupa"
        style={{ cursor: "pointer" }}
        onMouseEnter={lupaHover.handleMouseEnter}
        onMouseLeave={lupaHover.handleMouseLeave}
        onClick={handleLupaClick}
      />

      {/* Luster image */}

      <img
        className="luster" // optional active class
        src="/images/prolece/dan/luster.webp" // your lamp image
        alt="Luster"
        style={{ cursor: "pointer" }}
        onMouseEnter={lusterHover?.handleMouseEnter}
        onMouseLeave={lusterHover?.handleMouseLeave}
        onClick={handleLusterClick}
      />
    </div>
  );
}
