import { useEffect } from "react";

/**
 * Hace aparecer al hacer scroll todo elemento con el atributo `data-reveal`.
 * Cuando entra en pantalla le agrega `data-shown` (el CSS está en index.css).
 * Para escalonar varios elementos, pasales style={{ "--d": índice }}.
 */
export function useReveal() {
  useEffect(() => {
    const elementos = document.querySelectorAll("[data-reveal]:not([data-shown])");
    const mostrar = (el) => el.setAttribute("data-shown", "");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elementos.forEach(mostrar);
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            mostrar(entrada.target);
            observer.unobserve(entrada.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
