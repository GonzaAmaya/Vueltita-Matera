import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { hash: "historia", texto: "Historia" },
  { hash: "mapa", texto: "Mapa" },
  { hash: "asistente", texto: "Asistente" },
];

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const enHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cerrar = () => setMenuAbierto(false);

  return (
    <nav className={`nav ${scrolled || menuAbierto ? "scrolled" : ""}`} aria-label="Principal">
      <Link to="/" onClick={cerrar} aria-label="Vueltita Matera, inicio">
        <img src="/logo_nav.webp" alt="Vueltita Matera" className="logo" />
      </Link>

      <button
        type="button"
        className="boton-hamburguesa"
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMenuAbierto((v) => !v)}
      >
        {menuAbierto ? "✕" : "☰"}
      </button>

      <ul id="menu-principal" className={`menu ${menuAbierto ? "abierto" : ""}`}>
        {LINKS.map((l) => (
          <li key={l.hash}>
            {/* En una provincia, "Asistente" apunta a su propio asistente */}
            {enHome || l.hash === "asistente" ? (
              <a href={`#${l.hash}`} className="nav-btn" onClick={cerrar}>
                {l.texto}
              </a>
            ) : (
              <Link to={`/#${l.hash}`} className="nav-btn" onClick={cerrar}>
                {l.texto}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
