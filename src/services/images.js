const BASE_URL = process.env.REACT_APP_API_BASE || "https://recetario-app-backend.onrender.com";

export function resolveImageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${BASE_URL}${value}`;
  return value;
}
