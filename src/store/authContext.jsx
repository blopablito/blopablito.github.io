import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginUser, registerUser, updateUser } from "../services/api";

export const AuthContext = createContext({});

const STORAGE_KEY = "recetario_session_v1";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await loginUser({ email, password });
      const role = res.user?.is_admin ? "admin" : "user";
      const user = {
        id: res.user?.id,
        email: res.user?.email,
        username: res.user?.username,
        name: res.user?.name || res.user?.username,
        role,
        avatarUrl: res.user?.avatarUrl || null,
      };
      setSession({ user, token: res.token });
      return { success: true, ...res };
    } catch (error) {
       console.error(error);
       throw error; 
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const res = await registerUser(data);
      const role = res.user?.is_admin ? "admin" : "user";
      const user = {
        id: res.user?.id,
        email: res.user?.email,
        username: res.user?.username,
        name: res.user?.name || res.user?.username,
        role,
        avatarUrl: res.user?.avatarUrl || null,
      };
      setSession({ user, token: res.token });
      return { success: true, ...res };
    } catch (error) {
       console.error(error);
       throw error;
    }
  }, []);

  // Función segura para actualizar
  const updateProfile = useCallback(async (userId, data) => {
    if (!session?.token) {
        return { success: false, msg: "No hay sesión activa" };
    }

    try {
        const updatedUserRaw = await updateUser(userId, data, session.token);
        
        setSession((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                user: { ...prev.user, ...updatedUserRaw }
            };
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error updating profile", error);
        return { success: false, msg: error.message || "Error al actualizar" };
    }
  }, [session]);

  const logout = useCallback(() => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      role: session?.user?.role || "guest",
      isAuthenticated: !!session?.user,
      token: session?.token || null,
      login,
      register,
      logout,
      updateProfile
    }),
    [session, login, register, logout, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}