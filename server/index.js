// Servidor mínimo para el asistente de viaje.
// La API key de Anthropic vive SOLO acá (variable de entorno), nunca en el frontend.
//
//   npm run server          -> levanta http://localhost:8787
//   npm run dev             -> Vite redirige /api/* a este servidor (vite.config.js)
//
// En producción, servilo detrás del mismo dominio que el sitio (o como función
// serverless) y agregá rate limiting real.

import http from "node:http";
import Anthropic from "@anthropic-ai/sdk";

const PORT = Number(process.env.PORT) || 8787;
const MAX_MENSAJES = 20;
const MAX_CARACTERES = 2000;

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno

const SYSTEM = `Sos el asistente de viaje de "Vueltita Matera", una guía de turismo por la Argentina.
Hablás en español rioplatense, con voseo, cálido y directo, como alguien que conoce el país y recomienda a un amigo.

Tu trabajo: ayudar a planear viajes dentro de la Argentina. Recomendás destinos, armás itinerarios día por día, sugerís cuándo ir, cómo moverse, qué comer y qué tener en cuenta (altura, clima, distancias).

Reglas:
- Si te falta un dato clave (cantidad de días, época del año, desde dónde sale, qué le gusta), preguntá antes de armar un itinerario largo. Una o dos preguntas como máximo.
- Respondé corto: unos pocos párrafos o una lista breve. Nada de introducciones largas.
- Escribí en texto plano: sin markdown, sin asteriscos ni numerales para títulos. Para listas usá guiones simples.
- No inventes precios, horarios ni nombres de alojamientos. Si algo cambia seguido (precios, rutas cortadas, vuelos), decí que conviene confirmarlo antes de viajar.
- Si te preguntan algo que no tiene que ver con viajar por la Argentina, respondé amablemente que solo ayudás con eso.`;

function leerJSON(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = "";
    req.on("data", (chunk) => {
      cuerpo += chunk;
      if (cuerpo.length > 100_000) {
        reject(new Error("Cuerpo demasiado grande"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(cuerpo || "{}"));
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
    req.on("error", reject);
  });
}

// Valida y normaliza la conversación que manda el navegador.
function validarMensajes(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const recortados = messages.slice(-MAX_MENSAJES);
  // La conversación tiene que empezar con un mensaje del usuario
  while (recortados.length && recortados[0].role !== "user") recortados.shift();
  const limpios = [];
  for (const m of recortados) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return null;
    if (typeof m.content !== "string") return null;
    const content = m.content.slice(0, MAX_CARACTERES).trim();
    if (!content) continue;
    limpios.push({ role: m.role, content });
  }
  if (!limpios.length || limpios[limpios.length - 1].role !== "user") return null;
  return limpios;
}

function responderJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function manejarChat(req, res) {
  let body;
  try {
    body = await leerJSON(req);
  } catch (e) {
    return responderJSON(res, 400, { error: e.message });
  }

  const messages = validarMensajes(body.messages);
  if (!messages) return responderJSON(res, 400, { error: "Conversación inválida." });

  const provincia =
    typeof body.provincia === "string" ? body.provincia.slice(0, 60).trim() : "";

  // El contexto de la provincia va como bloque aparte para no romper el caché del prompt base.
  const system = [{ type: "text", text: SYSTEM }];
  if (provincia) {
    system.push({
      type: "text",
      text: `El usuario está mirando la página de ${provincia}. Enfocá tus respuestas en esa provincia, salvo que pregunte por otra cosa.`,
    });
  }

  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "low" }, // chat: respuestas rápidas
    // Si el modelo rechaza un pedido por política, el servidor reintenta con otro modelo.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages,
  });

  // Si el usuario cierra la página, cortamos la generación
  res.on("close", () => {
    if (!res.writableFinished) stream.abort();
  });

  let headersEnviados = false;
  try {
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        if (!headersEnviados) {
          res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff",
          });
          headersEnviados = true;
        }
        res.write(event.delta.text);
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      const aviso = "Perdón, con eso no te puedo ayudar. ¿Querés que armemos otra parte del viaje?";
      if (!headersEnviados) return responderJSON(res, 200, { error: aviso });
      res.write(`\n\n${aviso}`);
    }
    res.end();
  } catch (error) {
    if (stream.aborted || res.destroyed) return;
    console.error("[asistente]", error);

    let mensaje = "El asistente no está disponible en este momento. Probá en un rato.";
    if (error instanceof Anthropic.AuthenticationError) {
      mensaje = "Falta configurar la API key del asistente en el servidor.";
    } else if (error instanceof Anthropic.RateLimitError) {
      mensaje = "Hay mucha demanda ahora. Esperá unos segundos y probá de nuevo.";
    }

    if (!headersEnviados) return responderJSON(res, 502, { error: mensaje });
    res.end(`\n\n${mensaje}`);
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") return manejarChat(req, res);
  responderJSON(res, 404, { error: "No encontrado" });
});

server.listen(PORT, () => {
  console.log(`Asistente escuchando en http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠  ANTHROPIC_API_KEY no está definida. Copiá .env.example a .env y completala.");
  }
});
