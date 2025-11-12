// src/store/favsStore.js
import {
  addFavoriteToServer,
  getFavoritesFromServer,
  removeFavoriteFromServer,
} from "../services/api";

const KEY = "sr_favs_v1"; // mapeo por usuario: { [userId]: { ids: string[], items: { [id]: recipe } } }

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
  if (!userId || !recipe?.id) return { ids: getFavIds(userId) };

  const id = String(recipe.id);
  const all = ensureUserNode(userId);
  const node = all[userId];

  const exists = node.ids.includes(id);
  if (exists) {
    node.ids = node.ids.filter((x) => x !== id);
    delete node.items[id];
    saveAll(all);
    // intento de sync (ignorado si el backend aún no lo implementa)
    try { await removeFavoriteFromServer(userId, id); } catch {}
  } else {
    node.ids.unshift(id);
    node.items[id] = recipe;
    saveAll(all);
    try { await addFavoriteToServer(userId, id); } catch {}
  }
  return { ids: node.ids.slice(), items: { ...node.items } };
}

// opcional: traer favoritos del server y fusionar
export async function syncFavorites(userId) {
  if (!userId) return;
  try {
    const server = await getFavoritesFromServer(userId);
    if (!Array.isArray(server)) return;

    const all = ensureUserNode(userId);
    const node = all[userId];

    const serverIds = server.map((r) => String(r.id));
    const set = new Set([...serverIds, ...node.ids]);
    node.ids = Array.from(set);

    // si el server devolvió objetos completos:
    for (const r of server) node.items[String(r.id)] = r;

    saveAll(all);
  } catch {
    // silenciar: endpoint puede no existir aún
  }
}
