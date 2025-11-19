// src/components/AdminRecipeForm.jsx
import { useEffect, useMemo, useState } from "react";

const DIFFICULTIES = ["fácil", "media", "difícil"];

export default function AdminRecipeForm({ initial = null, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [cookTime, setCookTime] = useState(initial?.cookTime ?? 0);
  const [servings, setServings] = useState(initial?.servings ?? 1);
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "media");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? []);
  const [instructions, setInstructions] = useState(initial?.instructions ?? []);
  const [restrictions, setRestrictions] = useState(initial?.restrictions ?? []);
  const [error, setError] = useState("");

  useEffect(() => { setError(""); }, [name, description, image, cookTime, servings, difficulty, category, ingredients, instructions, restrictions]);

  const payload = useMemo(() => ({
    name, description, image, cookTime, servings, difficulty, category,
    ingredients, instructions, restrictions,
  }), [name, description, image, cookTime, servings, difficulty, category, ingredients, instructions, restrictions]);

  const handleAddToList = (setter, value) => {
    const v = value.trim();
    if (!v) return;
    setter((prev) => [...prev, v]);
  };
  const handleRemoveFromList = (setter, idx) => {
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!name.trim()) return "El nombre es obligatorio";
    if (!description.trim()) return "La descripción es obligatoria";
    if (!Number.isFinite(Number(cookTime)) || cookTime < 0) return "Tiempo de cocción inválido";
    if (!Number.isFinite(Number(servings)) || servings <= 0) return "Porciones inválidas";
    if (!DIFFICULTIES.includes(String(difficulty).toLowerCase())) return "Dificultad inválida";
    if (ingredients.length === 0) return "Agrega al menos un ingrediente";
    if (instructions.length === 0) return "Agrega al menos un paso";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    await onSubmit?.(payload);
  };

  const [ingInput, setIngInput] = useState("");
  const [instInput, setInstInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Nombre</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nombre de la receta" />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Descripción</label>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe la receta" rows={3} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Imagen (URL)</label>
        <input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="https://..." />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Tiempo de cocción (min)</label>
        <input type="number" value={cookTime} onChange={(e)=>setCookTime(Number(e.target.value))} min={0} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Porciones</label>
        <input type="number" value={servings} onChange={(e)=>setServings(Number(e.target.value))} min={1} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Dificultad</label>
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Categoría</label>
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Postre, Plato principal..." />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Ingredientes</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={ingInput} onChange={(e)=>setIngInput(e.target.value)} placeholder="Agregar ingrediente" />
          <button type="button" className="btn" onClick={() => { handleAddToList(setIngredients, ingInput); setIngInput(""); }}>
            Añadir
          </button>
        </div>
        <ul>
          {ingredients.map((ing, idx) => (
            <li key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{idx + 1}. {ing}</span>
              <button type="button" className="btn-outline" onClick={() => handleRemoveFromList(setIngredients, idx)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Pasos</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={instInput} onChange={(e)=>setInstInput(e.target.value)} placeholder="Agregar paso" />
          <button type="button" className="btn" onClick={() => { handleAddToList(setInstructions, instInput); setInstInput(""); }}>
            Añadir
          </button>
        </div>
        <ul>
          {instructions.map((step, idx) => (
            <li key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{idx + 1}. {step}</span>
              <button type="button" className="btn-outline" onClick={() => handleRemoveFromList(setInstructions, idx)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Etiquetas (restricciones)</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} placeholder="vegano, sin gluten..." />
          <button type="button" className="btn" onClick={() => { handleAddToList(setRestrictions, tagInput); setTagInput(""); }}>
            Añadir
          </button>
        </div>
        <ul>
          {restrictions.map((t, idx) => (
            <li key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{t}</span>
              <button type="button" className="btn-outline" onClick={() => handleRemoveFromList(setRestrictions, idx)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && <div style={{ color: "var(--danger)" }}>{error}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="btn">{initial ? "Guardar cambios" : "Crear receta"}</button>
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
