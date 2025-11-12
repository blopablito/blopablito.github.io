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

// Normalizador fiel al modelo del backend
function mapRecipe(r = {}) {
  return {
    _id: String(r._id),
    name: r.name,
    description: r.description,
    image: r.image, // ej: "/assets/images/recipes/000001.jpg"
    cookTime: Number(r.cookTime),
    servings: r.servings,
    difficulty: String(r.difficulty).toLowerCase(), // fácil, intermedio, difícil
    category: r.category,
    restrictions: r.restrictions ?? [],
    ingredients: r.ingredients ?? [],
    instructions: r.instructions ?? [],
  };
}

const mapList = (arr) => (Array.isArray(arr) ? arr.map(mapRecipe) : []);

// Endpoints
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
