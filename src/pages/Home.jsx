import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const [recetas, setRecetas] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setRecetas([
      {
        id: 1,
        nombre: 'Pasta Carbonara Clásica',
        descripcion: 'Un delicioso plato italiano con huevos, queso parmesano, panceta y pimienta negra.',
        tiempo: '20 minutos',
        porciones: '4',
        categoria: 'Pastas',
        dificultad: 'Intermedio',
        imagen: 'https://images.unsplash.com/photo-1603133872872-6e7b3f6f3f3f'
      },
      {
        id: 2,
        nombre: 'Tarta de Chocolate Decadente',
        descripcion: 'Una rica tarta de chocolate con ganache suave y bizcocho esponjoso.',
        tiempo: '90 minutos',
        porciones: '8',
        categoria: 'Postres',
        dificultad: 'Difícil',
        imagen: 'https://images.unsplash.com/photo-1601979031925-6f3b3f3f3f3f'
      },
      {
        id: 3,
        nombre: 'Ensalada Mediterránea Fresca',
        descripcion: 'Una ensalada vibrante con verduras frescas, aceitunas, queso feta y limón.',
        tiempo: '15 minutos',
        porciones: '4',
        categoria: 'Ensaladas',
        dificultad: 'Fácil',
        imagen: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7'
      },
      {
        id: 4,
        nombre: 'Pollo a la Parrilla con Hierbas',
        descripcion: 'Jugoso pollo marinado con hierbas aromáticas y cocido a la perfección.',
        tiempo: '45 minutos',
        porciones: '4',
        categoria: 'Carnes',
        dificultad: 'Intermedio',
        imagen: 'https://images.unsplash.com/photo-1604908177522-3f3f3f3f3f3f'
      },
      {
        id: 5,
        nombre: 'Pizza Margherita Artesanal',
        descripcion: 'Pizza italiana con masa casera, salsa de tomate, mozzarella y albahaca.',
        tiempo: '120 minutos',
        porciones: '2',
        categoria: 'Pizzas',
        dificultad: 'Intermedio',
        imagen: 'https://images.unsplash.com/photo-1601924582975-3f3f3f3f3f3f'
      },
      {
        id: 6,
        nombre: 'Sushi Variado Japonés',
        descripcion: 'Selección de sushi con salmón, atún y anguila, preparado como arte japonés.',
        tiempo: '60 minutos',
        porciones: '6',
        categoria: 'Japonesa',
        dificultad: 'Difícil',
        imagen: 'https://images.unsplash.com/photo-1603133872872-3f3f3f3f3f3f'
      }
    ]);
  }, []);

  const recetasFiltradas = recetas.filter(r =>
    (filtro === 'Todos' || r.categoria === filtro) &&
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main>
      <SearchBar onSearch={setBusqueda} />
      <CategoryFilter
        categories={['Todos', 'Carnes', 'Ensaladas', 'Japonesa', 'Pastas', 'Pizzas', 'Postres']}
        selected={filtro}
        onSelect={setFiltro}
      />
      <p style={{ padding: '0 2rem', color: '#888' }}>
        {recetasFiltradas.length} recetas disponibles
      </p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        {recetasFiltradas.map((r) => (
          <RecipeCard key={r.id} receta={r} />
        ))}
      </div>
    </main>
  );
}
