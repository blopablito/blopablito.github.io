// src/pages/Favorites.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getFavItems, toggleFav } from "../store/favsStore";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (user) setFavs(getFavItems(user.id));
  }, [user]);

  const handleFav = (r) => {
    const { items } = toggleFav(user.id, r);
    setFavs(Object.values(items));
  };

  if (!user) return <div className="container">Inicia sesión para ver tus favoritos</div>;

  return (
    <div id="favorites" className="container">
      <h1 className="page-title">Mis Favoritos</h1>
      {favs.length === 0 ? (
        <div className="empty">No tienes recetas favoritas aún.</div>
      ) : (
        <div className="recipes-grid">
          {favs.map((r) => (
            <RecipeCard key={r.id} receta={r} onFav={handleFav} isFav />
          ))}
        </div>
      )}
    </div>
  );
}
