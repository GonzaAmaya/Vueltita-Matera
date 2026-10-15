import { useState } from "react";
import "../components/Hero.css";
import fondo from '../img/hero.webp';

function Hero() {
    return(
    <section className="hero">
        <img src={fondo} alt="hero inicial" className="fondo"/>

        <div className="hero-overlay"></div>

        <div className="hero-content">
            <span>Turismo Argentino</span>
            <h1>Elegí una provincia. Empezá tu vuelta.</h1>
            <p>Tocá el mapa y descubrí que te espera en cada rincón del país.</p>
            
            <div className="hero-botones">
            <a href="#mapa" className="btn-hero btn-hero-principal">Ver mapa</a>
            <a href="#asistente" className="btn-hero btn-hero-secundario">Asistente virtual</a>
            </div>
        </div>
        
    </section>
    );
}

export default Hero;