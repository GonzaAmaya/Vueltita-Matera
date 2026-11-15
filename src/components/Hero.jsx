import "./Hero.css";
import fondo from "../assets/img/hero.webp";

function Hero() {
  return (
    <section className="hero">
      <img src={fondo} alt="" className="hero-fondo" fetchPriority="high" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <span className="hero-eyebrow hero-anim" style={{ "--d": 0 }}>
          Turismo argentino
        </span>
        <h1 className="hero-anim" style={{ "--d": 1 }}>
          Elegí una provincia. Empezá tu vuelta.
        </h1>
        <p className="hero-anim" style={{ "--d": 2 }}>
          Tocá el mapa y descubrí qué te espera en cada rincón del país.
        </p>

        <div className="hero-botones hero-anim" style={{ "--d": 3 }}>
          <a href="#mapa" className="btn-hero btn-hero-principal">
            Ver mapa
          </a>
          <a href="#asistente" className="btn-hero btn-hero-secundario">
            Asistente virtual
          </a>
        </div>
      </div>

      <a href="#historia" className="hero-scroll" aria-label="Bajar a la historia">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}

export default Hero;
