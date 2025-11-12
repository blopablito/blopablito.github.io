// src/components/RecipeCard.jsx
import { Link } from "react-router-dom";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export default function RecipeCard({ receta, onFav, isFav }) {
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
        <button className="btn" onClick={() => onFav(receta)}>
          {isFav ? "Quitar de Favoritos" : "Favorito"}
        </button>
      </div>
    </div>
  );
}
