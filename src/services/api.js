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

function mapRecipe(r = {}) {
  const id = r._id ?? r.id ?? r.recipeId ?? r.slug ?? String(Math.random());
  return {
    _id: String(id),
    name: r.name ?? r.title ?? "Receta",
    image: r.image ?? r.img ?? r.photo ?? "",
    cookTime: Number(r.cookTime ?? r.minutes ?? r.time ?? 0),
    difficulty: String(r.difficulty ?? r.level ?? "intermedio").toLowerCase(),
    category: r.category ?? r.meal ?? "Sin categoría",
    restrictions: r.restrictions ?? r.tags ?? [],
    ingredients: r.ingredients ?? r.ingredientes ?? [],
    instructions: r.instructions ?? r.pasos ?? [],
  };
}

const mapList = (arr) => (Array.isArray(arr) ? arr.map(mapRecipe) : []);

// Helper que prueba /recipes y si falla prueba /api/recipes
async function tryEndpoints(paths) {
  let lastErr;
  for (const p of paths) {
    try {
      const data = await http(p);
      return data;
    } catch (e) {
      lastErr = e;
      // sigue al siguiente
    }
  }
  throw lastErr;
}

export async function getRecipes() {
  // Ajusta automáticamente según cómo esté montado el router del backend
  const data = await tryEndpoints(["/recipes", "/api/recipes"]);
  return mapList(data);
}

export async function getRecipeById(id) {
  try {
    const d1 = await http(`/recipes/${id}`);
    return mapRecipe(d1);
  } catch {
    const d2 = await http(`/api/recipes/${id}`);
    return mapRecipe(d2);
  }
}

export async function createRecipe(payload) {
  try {
    const d1 = await http(`/recipes`, { method: "POST", body: payload });
    return mapRecipe(d1);
  } catch {
    const d2 = await http(`/api/recipes`, { method: "POST", body: payload });
    return mapRecipe(d2);
  }
}

export async function updateRecipe(id, payload) {
  try {
    const d1 = await http(`/recipes/${id}`, { method: "PUT", body: payload });
    return mapRecipe(d1);
  } catch {
    const d2 = await http(`/api/recipes/${id}`, { method: "PUT", body: payload });
    return mapRecipe(d2);
  }
}

export async function deleteRecipe(id) {
  try {
    return await http(`/recipes/${id}`, { method: "DELETE" });
  } catch {
    return await http(`/api/recipes/${id}`, { method: "DELETE" });
  }
}
// --- Favoritos (opcionales): si el backend no los tiene, funcionan "silenciosamente" ---

async function tryUserEndpoints(paths, options) {
  let lastErr;
  for (const p of paths) {
    try {
      return await http(p, options);
    } catch (e) {
      lastErr = e;
      // probar siguiente ruta
    }
  }
  throw lastErr;
}

export async function addFavoriteToServer(userId, recipeId) {
  // POST /users/:id/favorites  ó  /api/users/:id/favorites
  try {
    return await tryUserEndpoints(
      [`/users/${userId}/favorites`, `/api/users/${userId}/favorites`],
      { method: "POST", body: { recipeId } }
    );
  } catch {
    // si no existe en el backend, no rompas el flujo del front
    return { ok: false, message: "favorites_not_supported" };
  }
}

export async function removeFavoriteFromServer(userId, recipeId) {
  // DELETE /users/:id/favorites/:recipeId  ó  /api/users/:id/favorites/:recipeId
  try {
    return await tryUserEndpoints(
      [`/users/${userId}/favorites/${recipeId}`, `/api/users/${userId}/favorites/${recipeId}`],
      { method: "DELETE" }
    );
  } catch {
    return { ok: false, message: "favorites_not_supported" };
  }
}

export async function getFavoritesFromServer(userId) {
  // GET /users/:id/favorites  ó  /api/users/:id/favorites
  try {
    const data = await tryUserEndpoints(
      [`/users/${userId}/favorites`, `/api/users/${userId}/favorites`],
      { method: "GET" }
    );
    // si devuelve un arreglo de recetas, normalízalo; si devuelve ids, devuélvelos tal cual
    return Array.isArray(data)
      ? data.map((r) => (typeof r === "object" ? mapRecipe(r) : String(r)))
      : [];
  } catch {
    return []; // sin soporte en backend → devuelve vacío
  }
}
