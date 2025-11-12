// src/store/authContext.jsx
import { createContext, useCallback, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    try {
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
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async ({ email, password, username, birthday, gender }) => {
    try {
      const res = await registerUser({ email, password, username, birthday, gender });
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
    } catch (err) {
      alert("Error al registrarse: " + err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const value = useMemo(() => ({
    user: session?.user || null,
    role: session?.user?.role || "guest",
    token: session?.token || null,
    login,
    register,
    logout,
  }), [session, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
