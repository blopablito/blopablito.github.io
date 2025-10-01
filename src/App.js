import React, { useEffect, useState } from 'react';
import './App.css';

const categorias = ['Todos', 'Carnes', 'Ensaladas', 'Japonesa', 'Pastas', 'Pizzas'];

function App() {
  const [recetas, setRecetas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  useEffect(() => {
    fetch('http://localhost:4000/api/recetas')
      .then(res => res.json())
      .then(data => setRecetas(data));
  }, []);

  const recetasFiltradas = categoriaSeleccionada === 'Todos'
    ? recetas
    : recetas.filter(r => r.categoria === categoriaSeleccionada);

  return (
    <div className="app">
      <h1>🍽️ Mi Recetario</h1>
      <div className="categorias">
        {categorias.map(cat => (
          <button
            key={cat}
            className={cat === categoriaSeleccionada ? 'activo' : ''}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="recetas">
        {recetasFiltradas.map(receta => (
          <div key={receta._id} className="tarjeta">
            <img src={receta.imagen} alt={receta.nombre} />
            <h3>{receta.nombre}</h3>
            <p>{receta.descripcion}</p>
            <div className="info">
              <span>⏱️ {receta.tiempo}</span>
              <span>🎯 {receta.dificultad}</span>
              <span>🍽️ {receta.porciones} porciones</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
