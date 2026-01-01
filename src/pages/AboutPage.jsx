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
        <h1 className="about-title">O nama</h1>

        <div className="hero-content">
          <div className="polaroid">
            <img src="/images/studio-photo.jpg" alt="Radni prostor studija" />
          </div>

          <div className="hero-note">
            <p>
              Kreativni Univerzum je nastao iz jednostavne ideje: da okupimo
              umetnike na jednom mestu i učinimo prodaju slika lakšom, lepšom i
              pristupačnijom. Mi smo grupa prijatelja koja veruje da je umetnost
              jača kada se deli — i kada ima pravi prostor da pronađe put do
              publike.
            </p>
          </div>
        </div>

        <div className="down-arrow">↓</div>
      </section>

      {/* STORY TIMELINE */}
      <section className="about-story">
        <h2 className="section-heading">Naša priča</h2>

        <div className="notes-grid">
          <div className="note-card">
            <span className="note-year">Kako je sve počelo</span>
            <p>
              Krenuli smo kao mali krug ljudi koji stvaraju iz ljubavi — skice,
              platna, boje, razgovori do kasno. Vrlo brzo smo shvatili da mnogim
              umetnicima nedostaje jednostavan način da svoje radove prikažu i
              prodaju bez komplikacija.
            </p>
          </div>

          <div className="note-card">
            <span className="note-year">Kreativna radionica</span>
            <p>
              Želeli smo da napravimo prostor koji nije samo galerija, već i
              mesto susreta i učenja. Zato smo osmislili „Kreativnu radionicu” —
              povremena okupljanja u kojima zajedno crtamo, slikamo,
              razmenjujemo tehnike i gradimo zajednicu.
            </p>
          </div>

          <div className="note-card">
            <span className="note-year">Umetnička kolonija</span>
            <p>
              S vremena na vreme iznajmimo veći prostor i organizujemo
              „Umetničku koloniju” — dan(e) posvećen(e) stvaranju, druženju i
              inspiraciji. Posebno nam je važno da uključimo decu: da dođu,
              probaju, uče i otkriju koliko je kreativnost prirodna i
              oslobađajuća.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <h2 className="section-heading">Naše vrednosti</h2>

        <div className="values-grid">
          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Zajednica</h3>
            <p>
              Povezujemo umetnike i publiku, gradimo prostor u kom su podrška i
              saradnja važniji od takmičenja.
            </p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Autentičnost</h3>
            <p>
              Verujemo u radove koji nose trag ruke i karakter — baš tu nastaje
              ono što je neponovljivo.
            </p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Učenje i rast</h3>
            <p>
              Kroz radionice i kolonije podstičemo razvoj, razmenu znanja i
              hrabrost da se isproba nešto novo.
            </p>
          </div>

          <div className="value-item">
            <div className="value-stamp">✦</div>
            <h3>Dostupnost</h3>
            <p>
              Umetnost treba da bude vidljiva i dostupna — i umetnicima koji
              žele da prodaju, i ljudima koji žele da pronađu delo koje im
              znači.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team">
        <h2 className="section-heading">Tim iza ideje</h2>

        <div className="team-grid">
          <div className="team-card">
            <div className="team-frame">
              <img src="/images/team-1.jpg" alt="Član tima" />
            </div>
            <h3>Osnivači</h3>
            <p>
              Mi smo grupa prijatelja koje povezuje ljubav prema crtanju,
              slikanju i kreativnom radu. Iako nam umetnost nije primarna
              profesija, ona je deo našeg svakodnevnog života — kao potreba, ne
              kao titula.
            </p>
          </div>

          <div className="team-card">
            <div className="team-frame">
              <img src="/images/team-2.jpg" alt="Organizatori radionica" />
            </div>
            <h3>Organizatori radionica</h3>
            <p>
              Naša uloga je da stvaramo prostor u kome umetnici mogu da se
              izraze, a deca i početnici da uče bez pritiska. Brinemo o
              prostoru, organizaciji i atmosferi — da kreativnost može slobodno
              da se dogodi.
            </p>
          </div>

          <div className="team-card">
            <div className="team-frame">
              <img src="/images/team-3.jpg" alt="Podrška umetnicima" />
            </div>
            <h3>Podrška umetnicima</h3>
            <p>
              Ne stvaramo umesto umetnika — već im pomažemo da njihovi radovi
              pronađu put do publike. Kreativni Univerzum je platforma, ne
              potpis.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="cta-overlay">
          <h2>Uđite u galeriju</h2>
          <p>
            Pogledajte radove naših umetnika, pronađite sliku koja vam “legne” i
            podržite kreativnu zajednicu koja raste iz dana u dan.
          </p>

          <button className="cta-button" onClick={handleGalleryClick}>
            Poseti galeriju
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
