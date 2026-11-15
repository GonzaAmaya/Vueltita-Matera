// Cada provincia vive en su propio archivo: src/data/provincias/<slug>.json
// (el mismo slug que figura en mapaPaths.js). Los lee el frontend y también
// el servidor del asistente (server-py/main.py).
//
// Para sumar o editar una provincia, tocá solo su JSON. Las imágenes van en
// public/provincias/<slug>/ con los nombres que indica el propio JSON.
const archivos = import.meta.glob("./provincias/*.json", { eager: true, import: "default" });

export const provincias = Object.fromEntries(
  Object.values(archivos).map((provincia) => [provincia.slug, provincia]),
);
