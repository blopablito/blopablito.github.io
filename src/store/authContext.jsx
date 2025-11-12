// src/store/authContext.jsx
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getSession, mockLogin, mockLogout, mockRegister, switchRole as mockSwitchRole } from "../services/auth.mock";

export const AuthContext = createContext({
  user: null,
  role: "guest",
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setRole: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    // Nada especial; ya persistimos en localStorage en el servicio
  }, []);

  const login = useCallback(async ({ email, role }) => {
    const s = await mockLogin({ email, role });
    setSession(s);
    return s;
  }, []);

  const register = useCallback(async ({ email, role }) => {
    const s = await mockRegister({ email, role });
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(async () => {
    await mockLogout();
    setSession(null);
  }, []);

  const setRole = useCallback(async (role) => {
    const s = await mockSwitchRole(role);
    setSession(s);
    return s;
  }, []);

  const value = useMemo(() => ({
    user: session?.user || null,
    role: session?.user?.role || "guest",
    login, register, logout, setRole,
  }), [session, login, register, logout, setRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
