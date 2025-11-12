// src/services/auth.mock.js (versión extendida)
const KEY = "sr_session_v2";

function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

function delay(ms = 350) { return new Promise(r => setTimeout(r, ms)); }

function makeSession({ email, role }) {
  const user = {
    id: email || "anon",
    email: email || "anon@example.com",
    name: (email || "Usuario").split("@")[0],
    role: role || "user",
  };
  const token = btoa(`${user.id}:${Date.now()}`);
  return { user, token, ts: Date.now() };
}

export async function mockLogin({ email, role = "user" }) {
  await delay();
  if (!email || !String(email).includes("@")) {
    const err = new Error("Correo inválido");
    err.code = "INVALID_EMAIL";
    throw err;
  }
  const s = makeSession({ email, role });
  save(s);
  return s;
}

export async function mockRegister({ email, role = "user" }) {
  await delay();
  // Aquí podrías simular "email ya registrado" si quieres
  const s = makeSession({ email, role });
  save(s);
  return s;
}

export async function mockLogout() {
  await delay(150);
  localStorage.removeItem(KEY);
  return true;
}

export async function switchRole(role = "user") {
  await delay(120);
  const s = getSession();
  if (!s?.user) return null;
  s.user.role = role;
  save(s);
  return s;
}
