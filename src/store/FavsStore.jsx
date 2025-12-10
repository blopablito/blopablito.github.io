const KEY = "sr_favs_v1"; 

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
function ensureUserNode(userId) {
  const all = loadAll();
  if (!all[userId]) all[userId] = { ids: [], items: {} };
  return all;
}

export function getFavIds(userId) {
  const all = loadAll();
  return all[userId]?.ids || [];
}

export function getFavItems(userId) {
  const all = loadAll();
  const node = all[userId];
  if (!node) return [];
  return node.ids.map((id) => node.items[id]).filter(Boolean);
}

export function isFav(userId, id) {
  return getFavIds(userId).includes(String(id));
}

export async function toggleFav(userId, recipe) {
  const recipeId = recipe?.id ?? recipe?._id;
  if (!userId || !recipeId) return { ids: getFavIds(userId) };

  const id = String(recipeId);
  const all = ensureUserNode(userId);
  const node = all[userId];

  const exists = node.ids.includes(id);
  if (exists) {
    node.ids = node.ids.filter((x) => x !== id);
    delete node.items[id];
  } else {
    node.ids.unshift(id);
    node.items[id] = { ...recipe, id };
  }
  saveAll(all);
  return { ids: node.ids.slice(), items: { ...node.items } };
}
