import { useRef } from "react";
export default function SpringNight({
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
        src="/images/prolece/noc/spring_night_comp.webp"
        alt="Studio Background"
        onLoad={() => {
          bgLoaded.current = true;
          tryReady();
        }}
      />

      <video
        className="landscape"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => {
          videoLoaded.current = true;
          tryReady();
        }}
      >
        <source
          src="/images/prolece/noc/spring_night_background.webm"
          type="video/webm"
        />
      </video>
      <video
        className="fire"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => {
          videoLoaded.current = true;
          tryReady();
        }}
      >
        <source
          src="/images/jesen/dan/art_room_fire.webm"
          type="video/webm"
        />
      </video>
      {/* Easel image */}

      <img
        className={`easel${active1 ? " active1" : ""}`}
        src="/images/prolece/noc/easel.webp"
        alt="Easel"
        onMouseEnter={easelHover.handleMouseEnter}
        onMouseLeave={easelHover.handleMouseLeave}
        onClick={handleEaselClick}
      />
      {/* Brushes image */}
      <img
        className={`brushes${active2 ? " active2" : ""}`}
        src="/images/prolece/noc/brushes.webp"
        alt="Brushes"
        onClick={handleBrushesClick}
        onMouseEnter={brushesHover.handleMouseEnter}
        onMouseLeave={brushesHover.handleMouseLeave}
      />
      <audio ref={audioRef} src="/recordings/oNama.wav" />
      {/* Picture image lel */}
      <img
        className={`picture${active4 ? " active4" : ""}`}
        src="/images/prolece/noc/picture.webp"
        alt="slicka"
        style={{ cursor: "pointer" }}
        onMouseEnter={pictureHover.handleMouseEnter}
        onMouseLeave={pictureHover.handleMouseLeave}
        onClick={handlePictureClick}
      />

      {/* Lupa image */}
      <img
        className={`lupa${active3 ? " active3" : ""}`}
        src="/images/prolece/noc/search.webp"
        alt="Lupa"
        style={{ cursor: "pointer" }}
        onMouseEnter={lupaHover.handleMouseEnter}
        onMouseLeave={lupaHover.handleMouseLeave}
        onClick={handleLupaClick}
      />

      {/* Luster image */}

      <img
        className="luster" // optional active class
        src="/images/prolece/noc/luster.webp" // your lamp image
        alt="Luster"
        style={{ cursor: "pointer" }}
        onMouseEnter={lusterHover?.handleMouseEnter}
        onMouseLeave={lusterHover?.handleMouseLeave}
        onClick={handleLusterClick}
      />
    </div>
  );
}
