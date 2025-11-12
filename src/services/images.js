// src/services/images.js
// Carga perezosa de todas las imágenes en src/assets/imagenes
const ctx = require.context("../assets/imagenes", false, /\.(png|jpe?g|webp|gif|avif)$/i);

// Devuelve una URL válida para <img src=...>
export function resolveImageUrl(value) {
  if (!value) return "";
  // Si ya parece URL absoluta, úsala tal cual
  if (/^https?:\/\//i.test(value)) return value;

  // Si es un nombre de archivo, intenta resolverlo localmente
  try {
    const key = `./${value}`;
    return ctx(key);
  } catch {
    // fallback: por si el backend envía subcarpetas o no existe el archivo
    return value;
  }
}
