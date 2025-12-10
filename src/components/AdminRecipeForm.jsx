import { useState, useEffect } from "react";

const CATEGORIES = ["Almuerzo", "Desayuno", "Cena", "Postre", "Snack", "Bebida"];
const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"];

export default function AdminRecipeForm({ initial, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    cookTime: "",
    servings: "",
    difficulty: "Fácil",
    category: "Almuerzo",
    ingredients: [],
    instructions: [],
    restrictions: []
  });

  const [tempIng, setTempIng] = useState("");
  const [tempStep, setTempStep] = useState("");
  const [tempRest, setTempRest] = useState("");

  useEffect(() => {
    if (initial) {
      setFormData({
        ...initial,
        ingredients: Array.isArray(initial.ingredients) ? initial.ingredients : [],
        instructions: Array.isArray(initial.instructions) ? initial.instructions : [],
        restrictions: Array.isArray(initial.restrictions) ? initial.restrictions : [],
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = (field, value, setTemp) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setTemp("");
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "#f5f5f5",
    borderRadius: "6px",
    marginBottom: "6px",
    fontSize: "0.9rem"
  };

  const deleteBtnStyle = {
    background: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
      
      <div style={{ display: "grid", gap: 6 }}>
        <label>Nombre</label>
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          placeholder="Ej: Lomo Saltado"
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Descripción</label>
        <textarea 
          name="description" 
          rows={3} 
          value={formData.description} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Imagen (URL)</label>
        <input 
          name="image" 
          value={formData.image} 
          onChange={handleChange} 
          placeholder="https://..." 
        />
        {formData.image ? (
            <div style={{ 
                marginTop: 8, 
                width: "100%", 
                height: 200, 
                borderRadius: 8, 
                overflow: "hidden", 
                border: "1px solid #ddd",
                background: "#eee"
            }}>
                <img 
                    src={formData.image} 
                    alt="Previsualización" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => e.target.style.display = 'none'} 
                />
            </div>
        ) : (
            <div style={{ padding: 20, background: "#f9f9f9", textAlign: "center", color: "#999", borderRadius: 8 }}>
                La imagen aparecerá aquí
            </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Tiempo (min)</label>
          <input 
            type="number" 
            name="cookTime" 
            value={formData.cookTime} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Porciones</label>
          <input 
            type="number" 
            name="servings" 
            value={formData.servings} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Dificultad</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Categoría</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Ingredientes</label>
        <div style={{ display: "flex", gap: 8 }}>
            <input 
                value={tempIng} 
                onChange={e => setTempIng(e.target.value)} 
                placeholder="Ej: 1kg de Papas"
                style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('ingredients', tempIng, setTempIng))}
            />
            <button type="button" className="btn-outline" onClick={() => addItem('ingredients', tempIng, setTempIng)}>Agregar</button>
        </div>
        <div style={{ marginTop: 8 }}>
            {formData.ingredients.map((item, i) => (
                <div key={i} style={listItemStyle}>
                    <span>• {item}</span>
                    <button type="button" style={deleteBtnStyle} onClick={() => removeItem('ingredients', i)}>X</button>
                </div>
            ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Instrucciones (Pasos)</label>
        <div style={{ display: "flex", gap: 8 }}>
            <input 
                value={tempStep} 
                onChange={e => setTempStep(e.target.value)} 
                placeholder="Ej: Cortar la cebolla..."
                style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('instructions', tempStep, setTempStep))}
            />
            <button type="button" className="btn-outline" onClick={() => addItem('instructions', tempStep, setTempStep)}>Agregar</button>
        </div>
        <div style={{ marginTop: 8 }}>
            {formData.instructions.map((item, i) => (
                <div key={i} style={listItemStyle}>
                    <span><strong>{i + 1}.</strong> {item}</span>
                    <button type="button" style={deleteBtnStyle} onClick={() => removeItem('instructions', i)}>X</button>
                </div>
            ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Restricciones / Etiquetas</label>
        <div style={{ display: "flex", gap: 8 }}>
            <input 
                value={tempRest} 
                onChange={e => setTempRest(e.target.value)} 
                placeholder="Ej: Vegano, Sin Gluten"
                style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('restrictions', tempRest, setTempRest))}
            />
            <button type="button" className="btn-outline" onClick={() => addItem('restrictions', tempRest, setTempRest)}>Agregar</button>
        </div>
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {formData.restrictions.map((item, i) => (
                <div key={i} style={{ ...listItemStyle, display: "inline-flex", background: "#e3f2fd", color: "#1565c0", gap: 8 }}>
                    <span>{item}</span>
                    <button type="button" style={{...deleteBtnStyle, background: "#1565c0"}} onClick={() => removeItem('restrictions', i)}>X</button>
                </div>
            ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <button className="btn" type="submit">Guardar Receta</button>
        <button className="btn-outline" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}