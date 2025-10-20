import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => setReceta(data));
  }, [id]);

  const añadirFavorito = async () => {
    await fetch("http://localhost:3001/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usuario123", recipeId: id }),
    });
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
                src={`http://localhost:3001${receta.image}`}
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
                <button className="btn" onClick={añadirFavorito}>♡ Añadir a favoritos</button>
                <button className="btn" onClick={() => navigate("/")}>← Volver al inicio</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
