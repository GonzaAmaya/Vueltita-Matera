import { useEffect, useRef, useState } from "react";
import "./Asistente.css";

const SUGERENCIAS_GENERALES = [
  "Tengo 7 días en abril, ¿adónde voy?",
  "Quiero ver glaciares, ¿cómo lo armo?",
  "Un finde largo desde Buenos Aires",
];

const sugerenciasPara = (provincia) => [
  `Armame 4 días en ${provincia}`,
  `¿Cuándo conviene ir a ${provincia}?`,
  `¿Qué tengo que comer en ${provincia}?`,
];

/**
 * Chat con el asistente de viaje. Habla con /api/chat (ver server/index.js),
 * que recibe la conversación y devuelve la respuesta como texto en streaming.
 * Si se pasa `provincia`, el asistente se enfoca en esa provincia.
 */
function Asistente({ provincia }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const listaRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes]);

  // Cancelar la respuesta en curso si se desmonta el componente
  useEffect(() => () => abortRef.current?.abort(), []);

  async function enviar(contenido) {
    const limpio = contenido.trim();
    if (!limpio || cargando) return;

    const historial = [...mensajes, { role: "user", content: limpio }];
    setMensajes([...historial, { role: "assistant", content: "" }]);
    setTexto("");
    setError(null);
    setCargando(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historial, provincia }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        // Sin JSON = respondió el proxy de Vite, no nuestro servidor (está apagado)
        throw new Error(
          data?.error ||
            "No pudimos contactar al asistente.",
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let respuesta = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        respuesta += decoder.decode(value, { stream: true });
        setMensajes([...historial, { role: "assistant", content: respuesta }]);
      }
      if (!respuesta.trim()) throw new Error("El asistente no respondió. Probá de nuevo.");
    } catch (e) {
      if (e.name === "AbortError") return;
      setError(e.message);
      // Sacamos la burbuja vacía y devolvemos el texto al input para reintentar
      setMensajes(historial.slice(0, -1));
      setTexto(limpio);
    } finally {
      setCargando(false);
      abortRef.current = null;
    }
  }

  const sugerencias = provincia ? sugerenciasPara(provincia) : SUGERENCIAS_GENERALES;
  const ultimo = mensajes[mensajes.length - 1];
  const esperandoPrimerToken = cargando && ultimo?.role === "assistant" && !ultimo.content;

  return (
    <div className="asis">
      <div className="asis-lista" ref={listaRef} aria-live="polite">
        {mensajes.length === 0 ? (
          <div className="asis-vacio">
            <p>
              ¡Hola! Soy el asistente de Vueltita Matera.{" "}
              {provincia
                ? `Preguntame lo que quieras sobre ${provincia}.`
                : "¿Qué tenés ganas de conocer?"}
            </p>
            <div className="asis-chips">
              {sugerencias.map((s) => (
                <button key={s} type="button" className="asis-chip" onClick={() => enviar(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          mensajes.map((m, i) => (
            <div key={i} className={`asis-msg asis-${m.role}`}>
              {m.content ||
                (esperandoPrimerToken && i === mensajes.length - 1 ? (
                  <span className="asis-escribiendo" aria-label="El asistente está escribiendo">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : null)}
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="asis-error" role="alert">
          {error}
        </p>
      )}

      <form
        className="asis-form"
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
      >
        <label htmlFor="asis-input" className="visually-hidden">
          Tu mensaje
        </label>
        <textarea
          id="asis-input"
          rows={1}
          value={texto}
          maxLength={2000}
          placeholder="Escribí tu pregunta…"
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar(texto);
            }
          }}
        />
        <button type="submit" className="asis-enviar" disabled={cargando || !texto.trim()}>
          {cargando ? "…" : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default Asistente;
