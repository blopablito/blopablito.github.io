// src/components/RecipeCard.jsx
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export default function RecipeCard({ receta, isFav: initialFav, onFav }) {
  // CAMBIO: Obtenemos también el token
  const { user, token } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(initialFav);
  const [toastMsg, setToastMsg] = useState("");

  // Sincronizar estado si las props cambian (importante para búsquedas)
  useEffect(() => {
    setIsFav(initialFav);
  }, [initialFav]);

  const handleFav = async () => {
    if (!user) {
      setToastMsg("Debes iniciar sesión para usar favoritos");
      return;
    }
    try {
      if (isFav) {
        // CAMBIO: Pasamos el token a la función de la API
        await removeFavorite(user.id, receta.id, token);
        setIsFav(false);
        setToastMsg("Se quitó de favoritos");
      } else {
        // CAMBIO: Pasamos el token a la función de la API
        await addFavorite(user.id, receta.id, token);
        setIsFav(true);
        setToastMsg("Se guardó en favoritos");
      }
      // Notificamos al padre (Home) para que actualice su lista
      if (onFav) await onFav();
      
    } catch (e) {
      console.error("Error al actualizar favorito:", e);
      setToastMsg("No se pudo actualizar favoritos");
    }
  };

  const handleDownloadRDF = () => {
    // Ajusta la URL base según tu entorno
    const API_BASE = "https://recetario-app-backend.onrender.com";
    const url = `${API_BASE}/rdf/${receta.id}`;
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
          <button className={`btn ${isFav ? "btn-danger" : ""}`} onClick={handleFav} style={isFav ? {backgroundColor: "#ff6b6b", borderColor: "#ff6b6b", color: "white"} : {}}>
            {isFav ? "Quitar Favorito" : "Favorito"}
          </button>
          <button className="btn-outline" onClick={handleDownloadRDF}>
            RDF
          </button>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}