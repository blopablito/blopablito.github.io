export default function SearchBar({ onSearch }) {
  return (
    <div style={{ padding: '1rem 2rem' }}>
      <input
        type="text"
        placeholder="Buscar recetas..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
}
