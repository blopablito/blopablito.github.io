import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [favoritos, setFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({ time: [], diff: [], type: [], rest: [] });

  useEffect(() => {
    fetch("http://localhost:3001/api/favorites/usuario123")
      .then(res => res.json())
      .then(data => {
        const adaptadas = data.map(r => ({
          id: r._id,
          title: r.name,
          description: r.description,
          image: r.image,
          minutes: r.cookTime,
          difficulty: r.difficulty.toLowerCase() === "media" ? "intermedia" : r.difficulty.toLowerCase(),
          meal: [r.category.toLowerCase()],
          restrictions: r.restrictions || [],
          author: r.author || 'Anónimo'
        }));
        setFavoritos(adaptadas);
      });
  }, []);

  const filtrarPorTiempo = (minutos) => {
    return filtros.time.length === 0 || filtros.time.some(rango => {
      const [min, max] = rango.split("-").map(Number);
      return minutos >= min && minutos <= max;
    });
  };

  const filtrar = r => (
    filtrarPorTiempo(r.minutes) &&
    (filtros.diff.length === 0 || filtros.diff.includes(r.difficulty)) &&
    (filtros.type.length === 0 || filtros.type.some(t => r.meal.includes(t))) &&
    (filtros.rest.length === 0 || filtros.rest.every(fr => r.restrictions.includes(fr)))
  );

  const favoritosFiltrados = favoritos.filter(filtrar);

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
          <div className="search-banner crema">Mis recetas favoritas</div>
          <div className="layout">
            <section className="panel recipes-section wide">
              <div className="grid">
                {favoritosFiltrados.length > 0 ? (
                  favoritosFiltrados.map(r => <RecipeCard key={r.id} receta={r} />)
                ) : (
                  <div className="empty">Aún no tienes recetas favoritas.</div>
                )}
              </div>
            </section>
            <aside className="panel filters narrow">
              <Filters filtros={filtros} setFiltros={setFiltros} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
