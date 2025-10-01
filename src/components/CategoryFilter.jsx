export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem 2rem',
      flexWrap: 'wrap'
    }}>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backgroundColor: selected === cat ? '#000' : '#eee',
            color: selected === cat ? '#fff' : '#333'
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
