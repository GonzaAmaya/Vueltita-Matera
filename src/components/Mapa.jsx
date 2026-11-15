import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROVINCIAS_MAPA } from "../data/mapaPaths.js";
import { provincias } from "../data/provincias.js";
import "./Mapa.css";

const ORDENADAS = [...PROVINCIAS_MAPA].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

function Mapa() {
  const navigate = useNavigate();
  const [activa, setActiva] = useState(null);

  const ir = (slug) => navigate(`/provincia/${slug}`);
  const seleccionada = PROVINCIAS_MAPA.find((p) => p.slug === activa);
  const tieneGuia = seleccionada && Boolean(provincias[seleccionada.slug]);

  return (
    <section id="mapa" className="mapa-seccion">
      <div className="vm-wrap mapa-grilla">
        <div className="mapa-contenedor" data-reveal>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="284 36 432 928"
            className="mapa-svg"
            role="group"
            aria-label="Mapa de la Argentina por provincias"
            onMouseLeave={() => setActiva(null)}
          >
            {PROVINCIAS_MAPA.map((p) => (
              <a
                key={p.id}
                // Las provincias "caen" de norte a sur al aparecer el mapa
                style={{ "--delay": `${Math.round(((p.label[1] - 60) / 870) * 700)}ms` }}
                href={`/provincia/${p.slug}`}
                aria-label={p.nombre}
                className={`mapa-prov ${activa === p.slug ? "activa" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  ir(p.slug);
                }}
                onMouseEnter={() => setActiva(p.slug)}
                onFocus={() => setActiva(p.slug)}
              >
                <path d={p.d}>
                  <title>{p.nombre}</title>
                </path>
              </a>
            ))}
          </svg>
        </div>

        <div className="tarjeta-mapa" aria-live="polite" data-reveal style={{ "--d": 2 }}>
          <span className="vm-eyebrow">Mapa interactivo</span>
          <div key={activa ?? "inicio"} className="tarjeta-cambio">
          {seleccionada ? (
            <>
              <h2 className="tarjeta-titulo">{seleccionada.nombre}</h2>
              <p>
                {tieneGuia
                  ? provincias[seleccionada.slug].lema
                  : "La guía completa está en camino. Entrá igual y planeá el viaje con el asistente."}
              </p>
              <span className={`tarjeta-estado ${tieneGuia ? "ok" : ""}`}>
                {tieneGuia ? "Guía disponible" : "Próximamente"}
              </span>
            </>
          ) : (
            <>
              <h2 className="tarjeta-titulo">Elegí tu próximo destino</h2>
              <p>
                Pasá por encima o tocá una provincia para explorar su historia,
                su cocina, cuándo ir y qué no te podés perder.
              </p>
            </>
          )}
          </div>

          <label className="mapa-select">
            <span>O elegila de la lista</span>
            <select
              value=""
              onChange={(e) => e.target.value && ir(e.target.value)}
            >
              <option value="">Seleccioná una provincia…</option>
              {ORDENADAS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

export default Mapa;
