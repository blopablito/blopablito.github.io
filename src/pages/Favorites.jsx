// src/pages/Favorites.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getUserFavorites } from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getUserFavorites(user.id);
        setList(data);
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return <div className="container">Inicia sesión para ver tus favoritos.</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Favoritos</h1>
      {loading ? (
        <div>Cargando…</div>
      ) : list.length === 0 ? (
        <div>Aún no tienes favoritos.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {list.map((r) => (
            <RecipeCard key={r.id} receta={r} isFav={true} />
          ))}
        </div>
      )}
    </div>
  );
}
