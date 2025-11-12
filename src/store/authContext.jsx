// src/store/authContext.jsx
import { createContext, useCallback, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext({
  user: null,
  role: "guest",
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setRole: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    const s = await loginUser({ email, password });
    // Asegura que exista user.id para favoritos
    const user = { ...s.user, id: s.user?.id ?? s.user?.email };
    setSession({ user, token: s.token });
    return { user, token: s.token };
  }, []);

  const register = useCallback(async ({ email, password }) => {
    const s = await registerUser({ email, password });
    const user = { ...s.user, id: s.user?.id ?? s.user?.email };
    setSession({ user, token: s.token });
    return { user, token: s.token };
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
  }, []);

  const setRole = useCallback(async (role) => {
    if (!session?.user) return null;
    const next = { ...session, user: { ...session.user, role } };
    setSession(next);
    return next;
  }, [session]);

  const value = useMemo(() => ({
    user: session?.user || null,
    role: session?.user?.role || "guest",
    token: session?.token || null,
    login, register, logout, setRole,
  }), [session, login, register, logout, setRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
