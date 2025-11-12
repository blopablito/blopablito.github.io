// src/services/api.js
const BASE_URL = process.env.REACT_APP_API_BASE || "https://recetario-app-backend.onrender.com";

async function http(path, { method = "GET", headers, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    mode: "cors",
    credentials: "omit",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

function absolutizeImage(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  // si viene como "/assets/..." del backend, convertir a absoluta
  if (image.startsWith("/")) return `${BASE_URL}${image}`;
  return image;
}

function mapRecipe(r = {}) {
  return {
    id: String(r._id ?? r.id),          // normaliza a "id"
    name: r.name,
    description: r.description,
    image: absolutizeImage(r.image),     // asegura URL válida
    cookTime: Number(r.cookTime),
    servings: r.servings,
    difficulty: String(r.difficulty || "").toLowerCase(), // fácil/intermedio/difícil
    category: r.category || "",          // único valor para filtros tipo
    restrictions: Array.isArray(r.restrictions) ? r.restrictions : [],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],
  };
}

const mapList = (arr) => (Array.isArray(arr) ? arr.map(mapRecipe) : []);

export async function getRecipes() {
  const data = await http("/api/recipes");
  return mapList(data);
}

export async function getRecipeById(id) {
  const data = await http(`/api/recipes/${id}`);
  return mapRecipe(data);
}

export async function createRecipe(payload) {
  const data = await http(`/api/recipes`, { method: "POST", body: payload });
  return mapRecipe(data);
}

export async function updateRecipe(id, payload) {
  const data = await http(`/api/recipes/${id}`, { method: "PUT", body: payload });
  return mapRecipe(data);
}

export async function deleteRecipe(id) {
  return await http(`/api/recipes/${id}`, { method: "DELETE" });
}
