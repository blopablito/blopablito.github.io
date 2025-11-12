// src/components/RecipeCard.jsx
import { resolveImageUrl } from "../services/images";
import { Link } from "react-router-dom";

export default function RecipeCard({ receta, onFav, isFav }) {
  const src = resolveImageUrl(receta.image);
  return (
    <article className="recipe-card">
      <img src={src} alt={receta.name} className="recipe-img" />
      <div className="recipe-body">
        <h3 className="recipe-title">
          <Link to={`/receta/${receta.id}`}>{receta.name}</Link>
        </h3>
        <div className="recipe-meta">⏱ {receta.cookTime} min · {receta.difficulty}</div>
        <div className="recipe-actions">
          <button className={isFav ? "btn fav active" : "btn fav"} onClick={() => onFav(receta)}>
            {isFav ? "★" : "☆"} Favorito
          </button>
        </div>
      </div>
    </article>
  );
}
