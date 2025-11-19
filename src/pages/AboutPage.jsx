import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AboutPage.css";
import Header from "./partials/Header.jsx";
import Footer from "./partials/Footer.jsx";


export default function AboutPage() {

  const navigate = useNavigate();

  const handleGalleryClick = () => {
    navigate("/");
  };

  return (
    <div className="about-container">
      <Header />
      {/* HERO */}
      <section className="about-hero">
        <h1 className="about-title">About Our Studio</h1>

        <div className="hero-content">
          <div className="polaroid">
            <img src="/images/studio-photo.jpg" alt="Studio workspace" />
          </div>

          <div className="hero-note">
            <p>
              In a quiet corner between scattered brushes and half-finished
              thoughts, our studio began as a single table, a warm lamp glow,
              and a desire to create something honest.
            </p>
          </div>
        </div>

        <div className="down-arrow">↓</div>
      </section>

      {/* STORY TIMELINE */}
      <section className="about-story">
        <h2 className="section-heading">Our Story</h2>

        <div className="notes-grid">
          <div className="note-card">
            <span className="note-year">The Beginning</span>
            <p>
              What started as a personal workshop slowly grew into a shared
              space where ideas mixed freely—like pigments in water—each artist
              bringing their own color to the canvas.
            </p>
          </div>

          <div className="note-card">
            <span className="note-year">A Studio in Motion</span>
            <p>
              Over time, our walls filled with sketches, our shelves with tools,
              and our tables with traces of experiments. This place became more
              than a workspace: it became a diary of hands learning, failing,
              and rising again.
            </p>
          </div>

          <div className="note-card">
            <span className="note-year">Where We Stand Now</span>
            <p>
              Today our studio exists as both a physical haven and a digital
              meeting point. Every piece we place into the world begins here,
              between the quiet rhythm of creation and the hum of imagination.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <h2 className="section-heading">Our Values</h2>

        <div className="values-grid">
          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Craft</h3>
            <p>
              We believe good art comes from slow hands, from time spent
              listening to the work itself.
            </p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Imperfection</h3>
            <p>
              The marks, smudges, and unexpected edges—these are the
              fingerprints of authenticity.
            </p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Patience</h3>
            <p>Every piece has a moment when it speaks. We wait for it.</p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Curiosity</h3>
            <p>
              We explore widely, experiment boldly, and never stop learning.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team">
        <h2 className="section-heading">Our Artists</h2>

        <div className="team-grid">
          {/* Example artist — replace with dynamic data if needed */}
          <div className="team-card">
            <div className="team-frame">
              <img src="/images/artist1.jpg" alt="Artist portrait" />
            </div>
            <h3>Artist Name</h3>
            <p>
              A collector of quiet moments, shaping them into stories of color
              and form.
            </p>
          </div>

          <div className="team-card">
            <div className="team-frame">
              <img src="/images/artist2.jpg" alt="Artist portrait" />
            </div>
            <h3>Artist Name</h3>
            <p>
              Finding meaning in texture, rhythm, and the beauty of small
              imperfect details.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="cta-overlay">
          <h2>Step into the Gallery</h2>
          <p>
            Our gallery is an open invitation. Wander slowly — discover
            something that feels like home.
          </p>

          <button className="cta-button" onClick={handleGalleryClick}>Visit the Gallery</button>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
