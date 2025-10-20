import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    // Cargar receta
    fetch(`https://recetario-app-backend.onrender.com/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => setReceta(data));

    // Verificar si está en favoritos
  fetch("https://recetario-app-backend.onrender.com/api/favorites/user123")
    .then(res => res.json())
    .then(data => {
      const ids = data.map(r => r._id); // el backend devuelve recetas completas
      setEsFavorito(ids.includes(id));
    });
  }, [id]);

  const añadirFavorito = async () => {
    await fetch("https://recetario-app-backend.onrender.com/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user123", recipeId: id }),
    });
    setEsFavorito(true);
  };

const eliminarFavorito = async () => {
  await fetch(`https://recetario-app-backend.onrender.com/api/favorites/${id}/user123`, {
    method: "DELETE",
  });
  setEsFavorito(false);
};

  if (!receta) return <div>Cargando...</div>;

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="brand">
            <span className="logo"></span>
            <span className="brand-title">SUPER RECETARIO</span>
          </div>
          <nav className="nav">
            <a href="/" className="nav-btn">Inicio</a>
            <a href="/favoritos" className="nav-btn">Favoritos</a>
            <a href="/perfil" className="nav-btn">Perfil</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="shell">
          <div className="search-banner crema">Información de la receta</div>

          <div className="recipe-layout" style={{ backgroundColor: "#FF6A3D" }}>
            <aside className="recipe-box">
              <img
                src={`https://recetario-app-backend.onrender.com${receta.image}`}
                alt={receta.name}
                className="recipe-image"
              />
            </aside>

            <section className="recipe-box">
              <h2>{receta.name}</h2>
              <p><strong>Duración:</strong> {receta.cookTime} min</p>
              <p><strong>Dificultad:</strong> {receta.difficulty}</p>
              <p><strong>Tipo:</strong> {receta.category}</p>
              <p><strong>Restricciones:</strong> {Array.isArray(receta.restrictions) ? receta.restrictions.join(", ") : "Ninguna"}</p>

              <h3>Ingredientes</h3>
              <ul>{receta.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>

              <h3>Instrucciones</h3>
              <ol>{receta.instructions.map((paso, i) => <li key={i}>{paso}</li>)}</ol>

              <div className="recipe-buttons">
                {!esFavorito ? (
                  <button className="btn" onClick={añadirFavorito}>♡ Añadir a favoritos</button>
                ) : (
                  <button className="btn" onClick={eliminarFavorito}>❤️ Eliminar de favoritos</button>
                )}
                <button className="btn" onClick={() => navigate("/")}>← Volver al inicio</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
