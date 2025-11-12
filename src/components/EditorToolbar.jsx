// src/components/EditorToolbar.jsx
export default function EditorToolbar({ onNew, query, setQuery }) {
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="panel-inner" style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <button className="btn" onClick={onNew}>➕ Nueva receta</button>
        <div style={{ marginLeft:"auto", minWidth:260, flex:"1 1 260px" }}>
          <div className="searchbar">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input placeholder="Buscar por título..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
