import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const [recetas, setRecetas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({ time: [], diff: [], type: [], rest: [] });

  useEffect(() => {
    fetch('http://localhost:3001/api/recipes')
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
        setRecetas(adaptadas);
      });
  }, []);

const filtrarPorTiempo = (minutos) => {
  return filtros.time.length === 0 || filtros.time.some(rango => {
    const [min, max] = rango.split("-").map(Number);
    return minutos >= min && minutos <= max;
  });
};


  const filtrar = r => {
    const text = busqueda.toLowerCase();
    return (
      (r.title.toLowerCase().includes(text) || r.description.toLowerCase().includes(text)) &&
      filtrarPorTiempo(r.minutes) &&
      (filtros.diff.length === 0 || filtros.diff.includes(r.difficulty)) &&
      (filtros.type.length === 0 || filtros.type.some(t => r.meal.includes(t))) &&
      (filtros.rest.length === 0 || filtros.rest.every(fr => r.restrictions.includes(fr)))
    );
  };

  const recetasFiltradas = recetas.filter(filtrar);

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="brand">
            <span className="logo"></span>
            <span className="brand-title">SUPER RECETARIO</span>
          </div>
          <nav className="nav">
            <a href="/" className="nav-btn active">Inicio</a>
            <a href="/favoritos" className="nav-btn">Favoritos</a>
            <a href="/perfil" className="nav-btn">Perfil</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="shell">
          <div className="search-section">
            <SearchBar value={busqueda} onChange={setBusqueda} />
          </div>
          <div className="layout">
            <section className="panel recipes-section">
              <div className="grid">
                {recetasFiltradas.length > 0 ? (
                  recetasFiltradas.map(r => <RecipeCard key={r.id} receta={r} />)
                ) : (
                  <div className="empty">No se encontraron recetas.</div>
                )}
              </div>
            </section>
            <aside className="panel filters">
              <Filters filtros={filtros} setFiltros={setFiltros} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
