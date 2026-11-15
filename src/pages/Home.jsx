import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Historia from "../components/Historia.jsx";
import Mapa from "../components/Mapa.jsx";
import Asistente from "../components/Asistente.jsx";
import Footer from "../components/Footer.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { irASeccion } from "../utils/irASeccion.js";

function Home() {
  const { hash } = useLocation();
  useReveal();

  // Al volver desde una provincia con /#mapa, vamos directo a la sección.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    irASeccion(hash.slice(1), { suave: false });
  }, [hash]);

  // Todos los links internos (#mapa, #historia, …) centran la sección.
  useEffect(() => {
    const alHacerClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || e.defaultPrevented) return;
      const id = link.getAttribute("href").slice(1);
      if (irASeccion(id)) {
        e.preventDefault();
        // Actualiza la URL sin que el navegador haga su propio salto
        window.history.replaceState(window.history.state, "", `#${id}`);
      }
    };
    document.addEventListener("click", alHacerClick);
    return () => document.removeEventListener("click", alHacerClick);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Historia />
        <Mapa />
        <section id="asistente" className="home-asistente">
          <div className="vm-wrap">
            <div data-reveal>
              <span className="vm-eyebrow">Asistente de viaje</span>
              <h2 className="vm-titulo">¿No sabés por dónde arrancar?</h2>
            </div>
            <p className="home-asistente-intro" data-reveal style={{ "--d": 1 }}>
              Contale cuántos días tenés, en qué época viajás y qué te gusta. Te
              propone destinos y un recorrido posible.
            </p>
            <div data-reveal style={{ "--d": 2 }}>
              <Asistente />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
