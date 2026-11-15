import { useEffect } from "react";

/**
 * Carrusel infinito para una pista que contiene los ítems DOS veces seguidas.
 * Cada `intervalo` ms corre la pista un ítem a la izquierda (variable CSS --i).
 *
 * Cuando llega a la copia del primer ítem (i === total) se ve idéntica a la
 * posición inicial. En el tick siguiente salta sin animación a i = 0 (no se
 * nota) y desde ahí se desliza a i = 1. Así siempre avanza para el mismo lado,
 * sin "rebobinar", y no depende del evento transitionend.
 *
 * Se pausa con el mouse encima o el foco adentro, cuando no está en pantalla
 * o la pestaña está oculta. Con "reducir movimiento" avanza sin deslizar.
 */
export function useCarruselInfinito(ref, total, { intervalo = 4000 } = {}) {
  useEffect(() => {
    const pista = ref.current;
    if (!pista || total < 2) return;

    let i = 0;
    let visible = false;
    let encima = false;
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const saltarA = (indice) => {
      pista.style.transition = "none";
      pista.style.setProperty("--i", indice);
      void pista.offsetWidth; // aplica el salto antes de reactivar la transición
      pista.style.transition = "";
    };

    const avanzar = () => {
      if (!visible || encima || document.hidden) return;

      if (sinMovimiento) {
        i = (i + 1) % total;
        saltarA(i);
        return;
      }

      if (i >= total) {
        i = 0;
        saltarA(0); // misma imagen que la copia: el salto es invisible
      }
      i += 1;
      pista.style.setProperty("--i", i);
    };

    const observer = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
      },
      { threshold: 0.4 },
    );
    observer.observe(pista.parentElement ?? pista);

    const entrar = () => (encima = true);
    const salir = () => (encima = false);

    pista.addEventListener("pointerenter", entrar);
    pista.addEventListener("pointerleave", salir);
    pista.addEventListener("focusin", entrar);
    pista.addEventListener("focusout", salir);
    const timer = setInterval(avanzar, intervalo);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      pista.removeEventListener("pointerenter", entrar);
      pista.removeEventListener("pointerleave", salir);
      pista.removeEventListener("focusin", entrar);
      pista.removeEventListener("focusout", salir);
    };
  }, [ref, total, intervalo]);
}
