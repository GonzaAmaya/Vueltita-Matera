import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProvinciaLanding from "../components/ProvinciaLanding.jsx";
import Asistente from "../components/Asistente.jsx";
import Footer from "../components/Footer.jsx";
import { provincias } from "../data/provincias.js";
import { PROVINCIAS_MAPA } from "../data/mapaPaths.js";
import "./Provincia.css";

function Provincia() {
  const { slug } = useParams();
  const provincia = provincias[slug];
  const enMapa = PROVINCIAS_MAPA.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    const nombre = provincia?.nombre ?? enMapa?.nombre;
    document.title = nombre
      ? `${nombre} · Vueltita Matera`
      : "Vueltita Matera · Turismo argentino";
  }, [slug, provincia, enMapa]);

  if (provincia) {
    return (
      <>
        <Navbar />
        <ProvinciaLanding
          provincia={provincia}
          asistente={<Asistente provincia={provincia.nombre} />}
        />
      </>
    );
  }

  // Provincia que existe en el mapa pero todavía no tiene su página.
  return (
    <>
      <Navbar />
      <main className="prox">
        <div className="vm-wrap prox-contenido">
          <span className="vm-eyebrow">{enMapa ? "Próximamente" : "Página no encontrada"}</span>
          <h1 className="vm-titulo">
            {enMapa ? enMapa.nombre : "Esa provincia no existe"}
          </h1>
          <p>
            {enMapa
              ? `Estamos armando la guía de ${enMapa.nombre}. Mientras tanto, el asistente ya te puede ayudar a planear el viaje.`
              : "Volvé al mapa y elegí una de las 24 jurisdicciones."}
          </p>
          <Link to="/#mapa" className="prox-volver">
            ← Volver al mapa
          </Link>
          {enMapa && (
            <div className="prox-asistente">
              <Asistente provincia={enMapa.nombre} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Provincia;
