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
        imagen: 'https://tse2.mm.bing.net/th/id/OIP.4Rn4Pnbhdy9f75q2ry06SgHaFD?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 2,
        nombre: 'Tarta de Chocolate Decadente',
        descripcion: 'Una rica tarta de chocolate con ganache suave y bizcocho esponjoso.',
        tiempo: '90 minutos',
        porciones: '8',
        categoria: 'Postres',
        dificultad: 'Difícil',
        imagen: 'https://thumbs.dreamstime.com/b/tarta-de-chocolate-decadente-postre-rico-con-ajo-menta-un-lujoso-armario-una-rebanada-deliciosa-servida-en-plato-minimalista-la-321550753.jpg'
      },
      {
        id: 3,
        nombre: 'Ensalada Mediterránea Fresca',
        descripcion: 'Una ensalada vibrante con verduras frescas, aceitunas, queso feta y limón.',
        tiempo: '15 minutos',
        porciones: '4',
        categoria: 'Ensaladas',
        dificultad: 'Fácil',
        imagen: 'https://tse2.mm.bing.net/th/id/OIP.O1TPN5Vw2fWty5_XH4DA1gHaGH?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 4,
        nombre: 'Pollo a la Parrilla con Hierbas',
        descripcion: 'Jugoso pollo marinado con hierbas aromáticas y cocido a la perfección.',
        tiempo: '45 minutos',
        porciones: '4',
        categoria: 'Carnes',
        dificultad: 'Intermedio',
        imagen: 'https://tse2.mm.bing.net/th/id/OIP.F6s5YDFbw-N7-3QTTDxV4AHaDv?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 5,
        nombre: 'Pizza Margherita Artesanal',
        descripcion: 'Pizza italiana con masa casera, salsa de tomate, mozzarella y albahaca.',
        tiempo: '120 minutos',
        porciones: '2',
        categoria: 'Pizzas',
        dificultad: 'Intermedio',
        imagen: 'https://tse2.mm.bing.net/th/id/OIP.6giCe_vM77glC889QoqzFAHaE6?rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 6,
        nombre: 'Sushi Variado Japonés',
        descripcion: 'Selección de sushi con salmón, atún y anguila, preparado como arte japonés.',
        tiempo: '60 minutos',
        porciones: '6',
        categoria: 'Japonesa',
        dificultad: 'Difícil',
        imagen: 'https://tse4.mm.bing.net/th/id/OIP.ibiMxqwB2a-vHAcW4-7gugHaE6?rs=1&pid=ImgDetMain&o=7&rm=3'
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
