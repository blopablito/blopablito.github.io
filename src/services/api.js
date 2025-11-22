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

function mapRecipe(r = {}) {
  return {
    id: String(r._id ?? r.id),
    name: r.name,
    description: r.description,
    image: absolutizeImage(r.image),
    cookTime: Number(r.cookTime ?? 0),
    servings: Number(r.servings ?? 0),
    difficulty: String(r.difficulty || "").toLowerCase(),
    category: r.category || "",
    restrictions: Array.isArray(r.restrictions)
      ? r.restrictions.map((x) => String(x || "").toLowerCase())
      : [],
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

export async function createRecipe(payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http(`/api/recipes`, { method: "POST", body: payload, headers });
  return mapRecipe(data);
}

export async function updateRecipe(id, payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http(`/api/recipes/${id}`, { method: "PUT", body: payload, headers });
  return mapRecipe(data);
}

export async function deleteRecipe(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return await http(`/api/recipes/${id}`, { method: "DELETE", headers });
}


export async function loginUser({ email, password }) {
  return await http("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function registerUser({ email, password, username, birthday, gender }) {
  const body = {
    email,
    password,
    username,
    birthday: birthday || null,
    gender: gender || null,
  };
  return await http("/api/auth/register", {
    method: "POST",
    body,
  });
}


export async function getUserFavorites(userId) {
  // 1. Corregida la sintaxis de comillas invertidas (template strings)
  // 2. La ruta apunta correctamente a authRoutes (/api/auth/favorites)
  const favoritesData = await http(`/api/auth/favorites/${userId}`);
  
  // 3. Solución de datos: El backend solo nos da IDs (recipe_id), 
  // así que debemos buscar los detalles completos de cada receta.
  if (Array.isArray(favoritesData)) {
    // Creamos una promesa para traer cada receta individualmente
    const promises = favoritesData.map(item => getRecipeById(item.recipe_id));
    
    // Esperamos a que todas las recetas carguen
    const recipes = await Promise.all(promises);
    
    // Filtramos posibles nulos en caso de que alguna receta se haya borrado
    return recipes.filter(r => r && r.id);
  }
  
  return [];
}

export async function addFavorite(userId, recipeId) {
  // Corregida sintaxis de comillas invertidas
  // authRoutes usa PUT para agregar
  return await http(`/api/auth/favorites/${userId}`, {
    method: "PUT", 
    body: { recipeId },
  });
}

export async function removeFavorite(userId, recipeId) {
  // Corregida sintaxis de comillas invertidas
  // authRoutes usa DELETE para eliminar
  return await http(`/api/auth/favorites/${userId}`, {
    method: "DELETE",
    body: { recipeId },
  });
}
