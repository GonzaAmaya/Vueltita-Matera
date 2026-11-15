# Vueltita Matera

Guía de turismo argentino: hero, breve historia del país, mapa SVG interactivo
que lleva a la página de cada provincia y un asistente de viaje con IA (Claude).

## Desarrollo

```bash
npm install
cp .env.example .env      # completá ANTHROPIC_API_KEY
npm run server            # asistente en http://localhost:8787
npm run dev               # sitio en http://localhost:5173 (en otra terminal)
```

Vite redirige `/api/*` al servidor del asistente, así la API key nunca llega al navegador.

### Alternativa: asistente en Python + Gemini

```bash
python -m venv server-py/.venv
server-py/.venv/Scripts/python -m pip install -r server-py/requirements.txt
# en .env: GEMINI_API_KEY=...  (opcional: GEMINI_MODEL=gemini-3.5-flash-lite)
npm run server:py       # reemplaza a "npm run server", mismo puerto y mismo endpoint
```

## Estructura

```
src/
  pages/        Home (/) y Provincia (/provincia/:slug)
  components/   Navbar, Hero, Historia, Mapa, Asistente, ProvinciaLanding, Footer
  data/
    mapaPaths.js   paths SVG de las 24 jurisdicciones + su slug
    provincias/    un JSON por provincia (<slug>.json), las 24 jurisdicciones
    provincias.js  carga todos esos JSON
server/index.js    endpoint POST /api/chat (Node + Claude)
server-py/main.py  endpoint POST /api/chat (Python + Gemini), usa los JSON como contexto
```

## Editar una provincia

Cada provincia es un archivo en `src/data/provincias/<slug>.json`, todos con el
mismo formato (el de `salta.json`):

- `datos`: 4 datos rápidos · `historia.hitos`: 5 · `lugares`: 5 · `sabores.items`: 5
- `cuando.epocas`: 3 · `mapa.rutas`: 3

Respetá esas cantidades: la grilla de lugares está diseñada para 5.
El `slug` tiene que coincidir con el de `mapaPaths.js`. El sitio y el asistente
toman los cambios solos, sin tocar código.

### Imágenes

Cada JSON indica sus rutas (`hero` y `lugares[].imagen`), por ejemplo
`public/provincias/mendoza/hero.webp`. Mientras no existan, se muestra el color de
`lugares[].color` como fondo.
