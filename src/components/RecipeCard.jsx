import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function RecipeCard({ receta }) {
  const navigate = useNavigate();
  const dificultad = receta.difficulty === "media" ? "intermedio" : receta.difficulty;

  const guardarFavorito = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await fetch(`${BASE_URL}/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user123", recipeId: receta._id }),
    });
    alert("Receta guardada en favoritos");
  };

  return (
    <div className="card" onClick={() => navigate(`/receta/${receta._id}`)}>
      <div className="card-inner">
        <img
          src={`${BASE_URL}${receta.image}`}
          alt={receta.title}
        />
        <div className="title">{receta.title}</div>
        <div className="meta">
          <div className="badge">🕒 {receta.minutes} min</div>
          <div className="badge">Dificultad: {dificultad}</div>
        </div>
        <div className="badges">
          {receta.restrictions.map((r) => (
            <span
              key={r}
              className={`badge ${
                r === "vegetariano"
                  ? "info"
                  : r === "sinlacteos" || r === "singluten"
                  ? "ok"
                  : "warn"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="badge">Tipo: {receta.meal.join(", ")}</div>
          <button
            className="btn"
            aria-label="Favorito"
            onClick={guardarFavorito}
          >
            ♡
          </button>
        </div>

        {/* Ver RDF */}
        <button
          style={{
            backgroundColor: "#a3d9a5",
            color: "#000",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            window.open(`${BASE_URL}/rdf/${receta._id}`, "_blank");
          }}
        >
          Ver RDF
        </button>
      </div>
    </div>
  );
}
