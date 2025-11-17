// src/components/Filters.jsx
const TIME = [
  { key: "15-30", label: "15 - 30 min" },
  { key: "30-45", label: "30 - 45 min" },
  { key: "45-60", label: "45 - 60 min" },
  { key: "60+",   label: "60 min a más" },
];
const DIFF = ["fácil", "intermedio", "difícil"];
const TYPES = ["Desayuno", "Almuerzo", "Cena", "Snack"];
const RESTR = ["vegetariano", "sin lacteos", "sin gluten"];

export default function Filters({ value = {}, onChange }) {
  const v = {
    time: value.time || [],
    difficulty: value.difficulty || [],
    type: value.type || [],
    restrictions: value.restrictions?.map(r => r.toLowerCase()) || [],
  };

  const toggle = (group, key) => {
    const set = new Set(v[group]);
    set.has(key) ? set.delete(key) : set.add(key);
    onChange?.({ ...v, [group]: Array.from(set) });
  };

  const clearAll = () => onChange?.({ time: [], difficulty: [], type: [], restrictions: [] });

  return (
    <>
      <h3>
        Filtros
        <button type="button" className="btn-outline" onClick={clearAll} aria-label="Limpiar filtros">Limpiar</button>
      </h3>

      <div className="group">
        <strong>Tiempo de preparación</strong>
        {TIME.map(({key,label}) => (
          <label key={key}><input type="checkbox" checked={v.time.includes(key)} onChange={()=>toggle("time", key)} /> {label}</label>
        ))}
      </div>

      <div className="group">
        <strong>Dificultad</strong>
        {DIFF.map((d) => (
          <label key={d}><input type="checkbox" checked={v.difficulty.includes(d)} onChange={()=>toggle("difficulty", d)} /> {d[0].toUpperCase()+d.slice(1)}</label>
        ))}
      </div>

      <div className="group">
        <strong>Tipo</strong>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          {TYPES.map((t) => (
            <label key={t}><input type="checkbox" checked={v.type.includes(t)} onChange={()=>toggle("type", t)} /> {t}</label>
          ))}
        </div>
      </div>

      <div className="group">
        <strong>Restricciones</strong>
        {RESTR.map((r) => (
          <label key={r}>
            <input type="checkbox" checked={v.restrictions.includes(r)} onChange={()=>toggle("restrictions", r)} />
            {r[0].toUpperCase() + r.slice(1)}
          </label>
        ))}
      </div>
    </>
  );
}
