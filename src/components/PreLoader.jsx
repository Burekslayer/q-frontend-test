import '../pages/styles/PreLoader.css';
export default function PreloaderOverlay({ isVisible }) {
  return (
    <div className={`preloader ${isVisible ? "show" : "hide"}`}>
      <div className="preloader-inner">
        <div className="spinner" />
        <div className="preloader-text">Loading...</div>
      </div>
    </div>
  );
}