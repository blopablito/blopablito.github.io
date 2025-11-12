// src/components/RecipeCard.jsx
import { Link } from "react-router-dom";

export default function RecipeCard({ receta, onFav, isFav }) {
  return (
    <article className="recipe-card">
      <img src={receta.image} alt={receta.name} className="recipe-img" />
      <div className="recipe-body">
        <h3 className="recipe-title">
          <Link to={`/receta/${receta.id}`}>{receta.name}</Link>
        </h3>
        <div className="recipe-meta">⏱ {receta.cookTime} min · {receta.difficulty}</div>
        <div className="recipe-tags">
          {receta.restrictions?.map((tag, idx) => (
            <span key={idx} className="tag">{tag[0].toUpperCase() + tag.slice(1)}</span>
          ))}
        </div>
        <div className="recipe-actions">
          <button className={isFav ? "btn fav active" : "btn fav"} onClick={() => onFav(receta)}>
            {isFav ? "★" : "☆"} Favorito
          </button>
        </div>
      </div>
    </article>
  );
}
