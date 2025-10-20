export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar panel" role="search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm11 3-6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        placeholder="Buscar recetas o ingredientes"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
