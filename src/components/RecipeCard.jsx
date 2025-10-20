import { useNavigate } from "react-router-dom";

export default function RecipeCard({ receta }) {
  const navigate = useNavigate();
  const dificultad = receta.difficulty === "media" ? "intermedia" : receta.difficulty;

  const guardarFavorito = async (e) => {
    e.stopPropagation(); // evita que se active el Link
    e.preventDefault();  // evita que se navegue
    await fetch("http://localhost:3001/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usuario123", recipeId: receta.id }),
    });
    alert("Receta guardada en favoritos");
  };

  return (
    <div className="card" onClick={() => navigate(`/receta/${receta.id}`)}>
      <div className="card-inner">
        <img src={`http://localhost:3001${receta.image}`} alt={receta.title} />
        <div className="title">{receta.title}</div>
        <div className="meta">
          <div className="badge">🕒 {receta.minutes} min</div>
          <div className="badge">Dificultad: {dificultad}</div>
        </div>
        <div className="badges">
          {receta.restrictions.map(r => (
            <span key={r} className={`badge ${r === 'vegetariano' ? 'info' : r === 'sinlacteos' || r === 'singluten' ? 'ok' : 'warn'}`}>
              {r}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="badge">Tipo: {receta.meal.join(', ')}</div>
          <button className="btn" aria-label="Favorito" onClick={guardarFavorito}>♡</button>
        </div>
      </div>
    </div>
  );
}