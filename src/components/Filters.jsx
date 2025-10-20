export default function Filters({ filtros, setFiltros }) {
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFiltros(prev => {
      const list = new Set(prev[name]);
      checked ? list.add(value) : list.delete(value);
      return { ...prev, [name]: [...list] };
    });
  };

  return (
    <form>
      <div className="section">
        <h3>Tiempo</h3>
        {['15-30', '30-45', '45-60', '60+'].map(v => (
          <label key={v}><input type="checkbox" name="time" value={v} onChange={handleChange} /> {v} min</label>
        ))}
      </div>
      <div className="section">
        <h3>Dificultad</h3>
        {['fácil', 'intermedio', 'difícil'].map(v => (
          <label key={v}><input type="checkbox" name="diff" value={v.toLowerCase()} onChange={handleChange} /> {v}</label>
        ))}
      </div>
      <div className="section">
        <h3>Tipo</h3>
        {['desayuno', 'almuerzo', 'cena', 'snack'].map(v => (
          <label key={v}><input type="checkbox" name="type" value={v} onChange={handleChange} /> {v}</label>
        ))}
      </div>
      <div className="section">
        <h3>Restricciones</h3>
        {['vegetariano', 'sinlacteos', 'singluten'].map(v => (
          <label key={v}><input type="checkbox" name="rest" value={v} onChange={handleChange} /> {v}</label>
        ))}
      </div>
    </form>
  );
}
