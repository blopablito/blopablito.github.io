import React from 'react';
import casita from '../assets/casita.png';

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src={casita} alt="Logo" style={{ width: '32px', height: '32px' }} />
        <h1 style={{ fontSize: '1.5rem' }}>Mi Recetario</h1>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button>Favoritas</button>
        <button>Perfil</button>
      </div>
    </header>
  );
}
