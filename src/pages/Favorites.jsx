import React from "react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const recetasFavoritas = [
    {
      id: 1,
      name: "Pastel de Papa",
      cookTime: 45,
      difficulty: "Media",
      image: "/images/pastel.jpg",
    },
    {
      id: 2,
      name: "Ensalada César",
      cookTime: 20,
      difficulty: "Fácil",
      image: "/images/cesar.jpg",
    },
  ];

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
            <a href="/favoritos" className="nav-btn active">Favoritos</a>
            <a href="/perfil" className="nav-btn">Perfil</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="shell">
          <div className="search-banner crema">Recetas favoritas</div>

          <div className="grid">
            {recetasFavoritas.map(r => (
              <Link to={`/receta/${r.id}`} key={r.id} className="card">
                <div className="card-inner">
                  <img src={r.image} alt={r.name} />
                  <div className="title">{r.name}</div>
                  <div className="meta">
                    <div className="badge">🕒 {r.cookTime} min</div>
                    <div className="badge">Dificultad: {r.difficulty}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

