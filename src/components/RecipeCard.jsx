// src/components/RecipeCard.jsx
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/images";

export default function RecipeCard({ receta, onFav, isFav = false }) {
  const {
    id,
    image,
    title,
    minutes,
    difficulty,
    meal = [],
    restrictions = [],
  } = receta || {};

  const imgSrc = resolveImageUrl(image);
  const mealText = Array.isArray(meal) ? meal.join(" · ") : meal || "—";
  const diffText = String(difficulty || "—");

  return (
    <article className="recipe-card" role="listitem">
      <div className="thumb">
        <Link to={`/receta/${id}`} aria-label={`Ver ${title || "receta"}`}>
          <img src={imgSrc} alt={title || "receta"} loading="lazy" />
        </Link>
      </div>

      <h3 className="title">
        <Link to={`/receta/${id}`}>{title || "Receta"}</Link>
      </h3>

      <div className="meta">
        <span>⏱ {minutes ?? "—"} min</span>
        <span style={{ textTransform: "capitalize" }}>{mealText}</span>
      </div>

      <div className="meta" style={{ marginTop: 2 }}>
        <span>Dif.: {diffText}</span>
      </div>

      {restrictions?.length ? (
        <div className="badges">
          {restrictions.map((r) => (
            <span key={r} className="badge ok">
              {r}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          type="button"
          className="btn-outline"
          onClick={() => onFav?.(receta)}
          aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          {isFav ? "♥ Favorito" : "♡ Favorito"}
        </button>
      </div>
    </article>
  );
}
