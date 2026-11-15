import { Link } from "react-router-dom";

const estilo = {
  background: "#141414",
  color: "rgba(255,255,255,0.75)",
  padding: "2rem 0",
  fontFamily: "var(--vm-display)",
  fontSize: "0.95rem",
};

function Footer() {
  return (
    <footer style={estilo}>
      <div
        className="vm-wrap"
        style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between" }}
      >
        <p>Vueltita Matera · Guía de turismo argentino</p>
        <Link to="/#mapa" style={{ color: "#fff" }}>
          Ver todas las provincias
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
