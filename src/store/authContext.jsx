// src/store/authContext.jsx
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext({});

const STORAGE_KEY = "recetario_session_v1";

// 🔎 Carga inicial desde localStorage
function loadInitialSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.user || !parsed.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadInitialSession());

  // 🔎 Validar token al iniciar
  useEffect(() => {
    async function validateSession() {
      if (!session?.token) return;
      try {
        const res = await fetch("/api/validate", {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (!res.ok) {
          setSession(null);
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        setSession(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    validateSession();
  }, []);

  // 🔎 Sincronizar cambios con localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async ({ email, password }) => {
    const res = await loginUser({ email, password });
    const role = res.user?.is_admin ? "admin" : "user";
    const user = {
      id: res.user?.id,
      email: res.user?.email,
      username: res.user?.username,
      role,
      avatarUrl: res.user?.avatarUrl || null,
    };
    setSession({ user, token: res.token });
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    const role = res.user?.is_admin ? "admin" : "user";
    const user = {
      id: res.user?.id,
      email: res.user?.email,
      username: res.user?.username,
      role,
      avatarUrl: res.user?.avatarUrl || null,
    };
    setSession({ user, token: res.token });
    return res;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const setRole = useCallback((nextRole) => {
    setSession((prev) => {
      if (!prev || !prev.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, role: nextRole },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      role: session?.user?.role || "guest",
      token: session?.token || null,
      login,
      register,
      logout,
      setRole,
    }),
    [session, login, register, logout, setRole]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
