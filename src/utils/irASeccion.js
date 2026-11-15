// Alto del navbar una vez que se scrolleó (ver .nav.scrolled en Navbar.css)
const NAV_ALTO = 60;

/**
 * Scrollea hasta una sección dejándola centrada en el espacio visible
 * debajo del navbar. Si la sección es más alta que la pantalla, la alinea
 * arriba (justo debajo del navbar) para que se lea desde el principio.
 * Se centra el contenido (.vm-wrap) y no la sección, para que el padding
 * de cada sección no lo corra.
 */
export function irASeccion(id, { suave = true } = {}) {
  const seccion = document.getElementById(id);
  if (!seccion) return false;

  const contenido = seccion.querySelector(".vm-wrap") ?? seccion;
  const caja = contenido.getBoundingClientRect();
  const disponible = window.innerHeight - NAV_ALTO;
  const arriba = caja.top + window.scrollY - NAV_ALTO;
  const margen = caja.height < disponible ? (disponible - caja.height) / 2 : 28;

  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: Math.max(0, arriba - margen),
    behavior: suave && !sinMovimiento ? "smooth" : "auto",
  });
  return true;
}
