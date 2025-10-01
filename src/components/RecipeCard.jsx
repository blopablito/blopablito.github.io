export default function RecipeCard({ receta }) {
  return (
    <div style={{
      width: '300px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <img src={receta.imagen} alt={receta.nombre} style={{ height: '180px', objectFit: 'cover' }} />
      <div style={{ padding: '1rem' }}>
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}>
          {receta.dificultad}
        </span>
        <h3>{receta.nombre}</h3>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>{receta.descripcion}</p>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#777' }}>
          ⏱️ {receta.tiempo} | 🍽️ {receta.porciones} | 🏷️ {receta.categoria}
        </div>
      </div>
    </div>
  );
}
