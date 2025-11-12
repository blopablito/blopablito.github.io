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
  if (image.startsWith("/")) return `${BASE_URL}${image}`;
  return image;
}

function capitalizeDifficulty(d) {
  const x = String(d || "").toLowerCase();
  if (x === "fácil" || x === "facil") return "Fácil";
  if (x === "intermedio") return "Intermedio";
  if (x === "difícil" || x === "dificil") return "Difícil";
  return "Intermedio";
}

function mapRecipe(r = {}) {
  return {
    id: String(r._id ?? r.id),
    name: r.name,
    description: r.description,
    image: absolutizeImage(r.image),
    cookTime: Number(r.cookTime),
    servings: Number(r.servings),
    difficulty: String(r.difficulty || "").toLowerCase(),
    category: r.category || "",
    restrictions: Array.isArray(r.restrictions) ? r.restrictions.map(x => x.toLowerCase()) : [],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],
  };
}

const mapList = (arr) => (Array.isArray(arr) ? arr.map(mapRecipe) : []);

// Recetas
export async function getRecipes() {
  const data = await http("/api/recipes");
  return mapList(data);
}
export async function getRecipeById(id) {
  const data = await http(`/api/recipes/${id}`);
  return mapRecipe(data);
}
export async function createRecipe(payload) {
  const body = {
    name: payload.name,
    description: payload.description ?? "",
    cookTime: Number(payload.cookTime),
    servings: Number(payload.servings ?? 1),
    difficulty: capitalizeDifficulty(payload.difficulty),
    category: payload.category || "",
    restrictions: (payload.restrictions || []).map(x => x.toLowerCase()),
    ingredients: payload.ingredients || [],
    instructions: payload.instructions || [],
  };
  const data = await http(`/api/recipes`, { method: "POST", body });
  return mapRecipe(data);
}
export async function updateRecipe(id, payload) {
  const body = {
    name: payload.name,
    description: payload.description ?? "",
    cookTime: Number(payload.cookTime),
    servings: Number(payload.servings ?? 1),
    difficulty: capitalizeDifficulty(payload.difficulty),
    category: payload.category || "",
    restrictions: (payload.restrictions || []).map(x => x.toLowerCase()),
    ingredients: payload.ingredients || [],
    instructions: payload.instructions || [],
    image: payload.image || undefined,
  };
  const data = await http(`/api/recipes/${id}`, { method: "PUT", body });
  return mapRecipe(data);
}
export async function deleteRecipe(id) {
  return await http(`/api/recipes/${id}`, { method: "DELETE" });
}

// Auth real
export async function loginUser({ email, password }) {
  // Esperado: { user: { id, email, role }, token }
  return await http("/api/auth/login", { method: "POST", body: { email, password } });
}
export async function registerUser({ email, password }) {
  // Esperado: { user, token }
  return await http("/api/auth/register", { method: "POST", body: { email, password } });
}
export async function getUserFavorites(userId) {
  const data = await http(`/api/auth/favorites/${userId}`);
  // Si el backend devuelve ids u objetos, mapea si aplica:
  return Array.isArray(data) ? data.map(mapRecipe) : [];
}
