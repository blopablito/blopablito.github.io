const BASE_URL = process.env.REACT_APP_API_BASE || "https://recetario-app-backend.onrender.com";

const capitalize = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s);

export default function RecipeCard({ receta, onFav, isFav }) {
  const imgSrc = `${BASE_URL}${receta.image}`;

  return (
    <div className="recipe-card">
      <img src={imgSrc} alt={receta.name} className="recipe-image" />
      <div className="recipe-content">
        <h3>{receta.name}</h3>
        <p><strong>Tiempo:</strong> {receta.cookTime} min</p>
        <p><strong>Dificultad:</strong> {capitalize(receta.difficulty)}</p>
        <p><strong>Tipo:</strong> {receta.category}</p>
        {receta.restrictions?.length > 0 && (
          <p><strong>Etiquetas:</strong> {receta.restrictions.join(", ")}</p>
        )}
        <button className="btn" onClick={() => onFav(receta)}>
          {isFav ? "Quitar de Favoritos" : "Favorito"}
        </button>
      </div>
    </div>
  );
}
