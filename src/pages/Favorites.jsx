// src/pages/Favorites.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getUserFavorites } from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        if (!user?.id) {
          setList([]);
        } else {
          const data = await getUserFavorites(user.id);
          if (mounted) setList(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setErrMsg("No se pudieron cargar tus favoritos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [user?.id]);

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Favoritos</h1>
        <div className="panel"><div className="panel-inner">Inicia sesión para ver tus favoritos.</div></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Favoritos</h1>
      <div className="panel">
        <div className="panel-inner">
          {loading && <div style={{ color: "var(--muted)" }}>Cargando…</div>}
          {errMsg && <div style={{ color: "var(--danger)" }}>{errMsg}</div>}
          {!loading && !errMsg && list.length === 0 && (
            <div style={{ color: "var(--muted)" }}>Aún no tienes favoritos.</div>
          )}
          {!loading && !errMsg && list.length > 0 && (
            <div style={{ display: "grid", gap: 12 }}>
              {list.map((r) => (
                <RecipeCard
                  key={r.id}
                  receta={r}
                  isFav={true}
                  onFav={() => {
                    // Aquí podrías implementar quitar del backend; por ahora feedback
                    alert("Se mantendrá sincronización de favoritos pronto.");
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
