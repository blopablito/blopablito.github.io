import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";

export default function RecipeCard({ receta, isFav: initialFav }) {
  const { user } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(initialFav);
  const [toastMsg, setToastMsg] = useState("");

  const handleFav = async () => {
    if (!user) {
      setToastMsg("Debes iniciar sesión para usar favoritos");
      return;
    }
    try {
      if (isFav) {
        await removeFavorite(user.id, receta.id);
        setIsFav(false); 
        setToastMsg("Se quitó de favoritos");
      } else {
        await addFavorite(user.id, receta.id);
        setIsFav(true); 
        setToastMsg("Se guardó en favoritos");
      }
    } catch (e) {
      console.error("Error al actualizar favorito:", e);
      setToastMsg("No se pudo actualizar favoritos");
    }
  };

  return (
    <div className="recipe-card">
      <Link to={`/receta/${receta.id}`}>
        <img src={receta.image} alt={receta.name} className="recipe-image" />
      </Link>
      <div className="recipe-content">
        <h3>
          <Link to={`/receta/${receta.id}`}>{receta.name}</Link>
        </h3>
        <p><strong>Tiempo:</strong> {receta.cookTime} min</p>
        <p><strong>Dificultad:</strong> {receta.difficulty}</p>
        <p><strong>Tipo:</strong> {receta.category}</p>
        <button className="btn" onClick={handleFav}>
          {isFav ? "Quitar de Favoritos" : "Favorito"}
        </button>
      </div>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}
