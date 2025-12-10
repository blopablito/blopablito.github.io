// src/pages/Favorites.jsx
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../store/authContext";
import { getUserFavorites } from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // CAMBIO: Usamos useCallback para que la función sea estable y no rompa el useEffect
  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getUserFavorites(user.id);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando favoritos:", e);
      setErrorMsg("No se pudieron cargar tus favoritos.");
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [user]); // Dependencia: user

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]); // Ahora incluimos loadFavorites sin miedo a bucles

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Favoritos</h1>
        <div className="panel">
          <div className="panel-inner">Inicia sesión para ver tus favoritos.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Favoritos</h1>
      <div className="panel">
        <div className="panel-inner">
          {loading && <div style={{ color: "var(--muted)" }}>Cargando…</div>}
          {errorMsg && <div style={{ color: "var(--danger)" }}>{errorMsg}</div>}
          {!loading && !errorMsg && list.length === 0 && (
            <div style={{ color: "var(--muted)" }}>Aún no tienes favoritos.</div>
          )}
          {!loading && !errorMsg && list.length > 0 && (
            <div style={{ display: "grid", gap: 12 }}>
              {list.map((r) => (
                <RecipeCard
                  key={r.id}
                  receta={r}
                  isFav={true}
                  onFav={async () => {
                    await loadFavorites();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}