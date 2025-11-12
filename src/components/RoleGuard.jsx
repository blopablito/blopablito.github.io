import { useContext } from "react";

// Este contexto lo crearemos en store/authContext.jsx
const Dummy = { role: "guest" };
const AuthContext = globalThis.__AUTH_CONTEXT__ || { Provider: ({children})=>children };

export function RoleGuard({ role = "user", children, fallback = null }) {
  try {
    // cuando creemos el contexto real, lo importaremos:
    // import { AuthContext } from "../store/authContext";
    const ctx = useContext(AuthContext) || Dummy;
    const current = (ctx.role || "guest").toLowerCase();
    const need = role.toLowerCase();

    const ok =
      (need === "user"   && (current === "user" || current === "editor")) ||
      (need === "editor" && current === "editor");

    return ok ? children : fallback;
  } catch {
    return fallback;
  }
}
