import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export default function RecipeCard({ receta, isFav: initialFav, onFav }) {
  const { user, token } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(initialFav);
  const [toastMsg, setToastMsg] = useState("");

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
        await removeFavorite(user.id, receta.id, token);
        setIsFav(false);
        setToastMsg("Se quitó de favoritos");
      } else {
        await addFavorite(user.id, receta.id, token);
        setIsFav(true);
        setToastMsg("Se guardó en favoritos");
      }
      if (onFav) await onFav();
    } catch (e) {
      console.error("Error al actualizar favorito:", e);
      setToastMsg("No se pudo actualizar favoritos");
    }
  };

  const handleDownloadRDF = () => {
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
    <div className="recipe-card" style={{ 
        border: "1px solid white", // CORRECCIÓN: Borde blanco solicitado
        overflow: "hidden" 
    }}>
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
        
        {/* CORRECCIÓN: Etiquetas con estilo visual (Pastillas azules) */}
        {receta.restrictions?.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {receta.restrictions.map((tag, idx) => (
                <span key={idx} style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "2px 10px",
                    borderRadius: 12,
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    display: "inline-block"
                }}>
                    {capitalize(tag)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto", paddingTop: 12 }}>
          <button className={`btn ${isFav ? "btn-danger" : ""}`} onClick={handleFav} style={isFav ? {backgroundColor: "#ff6b6b", borderColor: "#ff6b6b", color: "white"} : {}}>
            {isFav ? "Quitar" : "Favorito"}
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