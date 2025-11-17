import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export default function RecipeCard({ receta, isFav: initialFav, onFav }) {
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
      onFav && (await onFav());
    } catch (e) {
      console.error("Error al actualizar favorito:", e);
      setToastMsg("No se pudo actualizar favoritos");
    }
  };

  const handleDownloadRDF = () => {
    const url = `${process.env.REACT_APP_API_BASE || "https://recetario-app-backend.onrender.com"}/rdf/${receta.id}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `receta-${receta.id}.rdf`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <p><strong>Dificultad:</strong> {capitalize(receta.difficulty)}</p>
        <p><strong>Tipo:</strong> {receta.category}</p>
        {receta.restrictions?.length > 0 && (
          <p>
            <strong>Etiquetas:</strong>{" "}
            {receta.restrictions.map((tag, idx) => (
              <span key={idx} className="tag">{capitalize(tag)}</span>
            ))}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={handleFav}>
            {isFav ? "Quitar de Favoritos" : "Favorito"}
          </button>
          <button className="btn-outline" onClick={handleDownloadRDF}>
            Descargar RDF
          </button>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}
