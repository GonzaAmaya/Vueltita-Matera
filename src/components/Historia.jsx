import { useRef } from "react";
import { useCarruselInfinito } from "../hooks/useCarruselInfinito.js";
import "./Historia.css";

const HITOS = [
  {
    fecha: "Antes de 1500",
    titulo: "Pueblos originarios",
    texto:
      "Diaguitas, guaraníes, wichís, mapuches, tehuelches y muchos otros pueblos habitaban el territorio. El Imperio Inca llegó hasta el noroeste.",
  },
  {
    fecha: "1536 – 1580",
    titulo: "La llegada española",
    texto:
      "Pedro de Mendoza funda Buenos Aires en 1536; la ciudad se abandona y Juan de Garay la refunda en 1580.",
  },
  {
    fecha: "1810",
    titulo: "Revolución de Mayo",
    texto:
      "El 25 de mayo se forma en Buenos Aires la Primera Junta, el primer gobierno patrio.",
  },
  {
    fecha: "1816",
    titulo: "Independencia",
    texto:
      "El 9 de julio, el Congreso reunido en San Miguel de Tucumán declara la independencia.",
  },
  {
    fecha: "1853",
    titulo: "Constitución Nacional",
    texto:
      "Se sanciona en Santa Fe la Constitución que, con reformas, sigue vigente.",
  },
  {
    fecha: "1880 – 1930",
    titulo: "La gran inmigración",
    texto:
      "Millones de inmigrantes, sobre todo italianos y españoles, llegan al país y moldean su cultura, su habla y su cocina.",
  },
  {
    fecha: "1983",
    titulo: "Vuelve la democracia",
    texto:
      "Tras la última dictadura, la Argentina recupera la democracia, que se mantiene sin interrupciones desde entonces.",
  },
];

const ESTADISTICAS = [
  { valor: "23 + 1", texto: "provincias y la Ciudad Autónoma de Buenos Aires" },
  { valor: "+46 M", texto: "de habitantes" },
  { valor: "8.º", texto: "país más grande del mundo" },
];

function Historia() {
  const lineaRef = useRef(null);
  useCarruselInfinito(lineaRef, HITOS.length);

  return (
    <section id="historia" className="historia">
      <div className="vm-wrap">
        <div className="historia-intro" data-reveal>
          <span className="vm-eyebrow">Un poco de historia</span>
          <h2 className="vm-titulo">De la Puna a Tierra del Fuego</h2>
          <p>
            Argentina es un país de contrastes: selva y Cataratas del Iguazú en el
            norte, glaciares en la Patagonia, la cordillera al oeste y la llanura
            pampeana en el centro. Su identidad se arma con la ronda de mate, el
            tango, el folklore, el fútbol, el asado, el Malbec y el dulce de
            leche.
          </p>
        </div>

        {/* Ventana que recorta la pista; la pista se desliza con transform (sin scroll) */}
        <div className="historia-ventana" data-reveal>
          <ol
            ref={lineaRef}
            className="historia-linea"
            aria-label="Línea de tiempo (avanza sola; pasá el mouse para pausarla)"
          >
            {/* Los hitos van dos veces: la copia permite el loop infinito sin volver atrás */}
            {[...HITOS, ...HITOS].map((h, i) => {
              const copia = i >= HITOS.length;
              return (
                <li
                  key={`${h.fecha}-${copia ? "copia" : "original"}`}
                  className="historia-hito"
                  aria-hidden={copia || undefined}
                  style={{ "--d": (i % HITOS.length) + 1 }}
                >
                  <span className="historia-fecha">{h.fecha}</span>
                  <h3>{h.titulo}</h3>
                  <p>{h.texto}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <dl className="estadisticas">
          {ESTADISTICAS.map((e, i) => (
            <div key={e.valor} className="estadistica" data-reveal style={{ "--d": i }}>
              <dt>{e.valor}</dt>
              <dd>{e.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Historia;
