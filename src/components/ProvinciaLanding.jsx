// src/components/ProvinciaLanding.jsx
import "./ProvinciaLanding.css";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Formas del borde inferior del hero (ver .prov-estratos--* en el CSS)
const SILUETAS = ["cordillera", "sierras", "llanura", "agua", "ciudad"];

// "estilo" en el JSON: silueta, cielo (fondo oscuro), acento y 5 colores de estratos.
// Sin "estilo", quedan los colores por defecto del CSS.
function variablesDeEstilo(estilo) {
  if (!estilo) return {};
  const vars = { "--prov-cielo": estilo.cielo, "--prov-roca": estilo.acento };
  estilo.paleta?.forEach((color, i) => {
    vars[`--prov-e${i + 1}`] = color;
  });
  return vars;
}

function ProvinciaLanding({ provincia, asistente }) {
  const { nombre, lema, hero, estilo, datos, historia, lugares, sabores, cuando, eventos, mapa } =
    provincia;
  const silueta = SILUETAS.includes(estilo?.silueta) ? estilo.silueta : "cordillera";

  return (
    <main className="prov" style={variablesDeEstilo(estilo)}>
      {/* HERO */}
      <header
        id="inicio"
        className="prov-hero"
        style={{ "--hero-img": `url(${hero})` }}
      >
        <div className="prov-wrap prov-hero-contenido">
          <h1 className="prov-hero-titulo">{nombre}</h1>
          <p className="prov-hero-lema">{lema}</p>
          <div className="prov-hero-acciones">
            <a href="#lugares" className="prov-btn prov-btn-principal">
              Ver qué hacer
            </a>
            <a href="#asistente" className="prov-btn prov-btn-borde">
              Armar mi viaje
            </a>
          </div>

          {/* DATOS RÁPIDOS */}
          <dl className="prov-datos-lista" aria-label={`Datos de ${nombre}`}>
            {datos.map((d) => (
              <div key={d.etiqueta} className="prov-dato">
                <dt>{d.etiqueta}</dt>
                <dd>{d.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={`prov-estratos prov-estratos--${silueta}`} aria-hidden="true" />
      </header>

      {/* Del hero al asistente, un único fondo continuo (ver .prov-cuerpo) */}
      <div className="prov-cuerpo">
        {/* HISTORIA */}
        <section id="historia" className="prov-seccion prov-historia">
          <div className="prov-wrap prov-historia-grilla">
            <div className="prov-historia-intro">
              <h2>{historia.titulo}</h2>
              <p>{historia.intro}</p>
            </div>
            <ol className="prov-hitos">
              {historia.hitos.map((h) => (
                <li key={h.fecha} className="prov-hito">
                  <span className="prov-hito-fecha">{h.fecha}</span>
                  <h3>{h.titulo}</h3>
                  <p>{h.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* LUGARES */}
        <section id="lugares" className="prov-seccion prov-lugares-seccion">
          <div className="prov-wrap">
            <div className="prov-cabecera">
              <h2>Qué hacer en {nombre}</h2>
            </div>
            <div className="prov-lugares">
              {lugares.map((l) => (
                <article
                  key={l.nombre}
                  className="prov-lugar"
                  style={{ "--img": `url(${l.imagen})`, "--fallback": l.color }}
                >
                  <div className="prov-lugar-texto">
                    <p className="prov-lugar-zona">{l.zona}</p>
                    <h3>{l.nombre}</h3>
                    <p>{l.descripcion}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SABORES */}
        <section id="sabores" className="prov-seccion prov-sabores">
          <div className="prov-wrap">
            <div className="prov-cabecera">
              <h2>{sabores.titulo}</h2>
              <p>{sabores.intro}</p>
            </div>
            <ul className="prov-sabores-lista">
              {sabores.items.map((s) => (
                <li key={s.nombre} className="prov-sabor">
                  <h3>{s.nombre}</h3>
                  <p>{s.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CUÁNDO IR */}
        <section id="cuando" className="prov-seccion prov-cuando">
          <div className="prov-wrap">
            <div className="prov-cabecera">
              <h2>{cuando.titulo}</h2>
            </div>
            <div className="prov-epocas">
              {cuando.epocas.map((e) => (
                <div key={e.nombre} className="prov-epoca">
                  <h3>{e.nombre}</h3>
                  <p>{e.texto}</p>
                </div>
              ))}
            </div>
            <p className="prov-consejo">{cuando.consejo}</p>
          </div>
        </section>

        {/* FIESTAS Y EVENTOS */}
        {eventos?.length > 0 && (
          <section id="eventos" className="prov-seccion prov-eventos">
            <div className="prov-wrap">
              <div className="prov-cabecera">
                <h2>Fiestas y eventos</h2>
                <p>
                  Lo que se celebra en {nombre} a lo largo del año. Las fechas
                  exactas cambian cada año: confirmalas antes de viajar.
                </p>
              </div>
              <ol className="prov-eventos-lista">
                {eventos.map((e) => (
                  <li key={e.nombre} className="prov-evento">
                    <span className="prov-evento-mes" aria-hidden="true">
                      {MESES[e.mes - 1]}
                    </span>
                    <div>
                      <h3>{e.nombre}</h3>
                      <p className="prov-evento-meta">
                        <strong>{e.fecha}</strong> · {e.lugar}
                      </p>
                      <p>{e.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* MAPA */}
        <section id="mapa" className="prov-seccion prov-mapa">
          <div className="prov-wrap">
            <div className="prov-cabecera">
              <h2>Cómo moverse</h2>
            </div>
            <iframe
              className="prov-mapa-marco"
              title={`Mapa de ${nombre}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapa.consulta
              )}&output=embed`}
            />
            <ul className="prov-rutas">
              {mapa.rutas.map((r) => (
                <li key={r.nombre}>
                  <strong>{r.nombre}</strong>
                  <span>{r.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>

      {/* ASISTENTE */}
      <section id="asistente" className="prov-seccion prov-asistente">
        <div className="prov-wrap prov-asistente-grilla">
          <div>
            <h2>{provincia.asistente.titulo}</h2>
            <p>{provincia.asistente.texto}</p>
          </div>
          <div className="prov-asistente-slot">
            {/* Pasá tu componente de asistente con la prop "asistente" */}
            {asistente ?? <p>Acá va el asistente de viaje.</p>}
          </div>
        </div>
      </section>

      {/* PIE */}
      <footer className="prov-pie">
        <div className="prov-wrap prov-pie-contenido">
          <p>Vueltita Matera, guía de turismo argentino.</p>
          <a href="/">Ver otras provincias</a>
        </div>
      </footer>
    </main>
  );
}

export default ProvinciaLanding;
