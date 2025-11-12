// src/components/RecipeForm.jsx
import { useEffect, useMemo, useState } from "react";

const DIFFS = ["fácil", "intermedio", "difícil"];
const TYPES = ["Desayuno", "Almuerzo", "Cena", "Snack"];
const RESTR = ["Vegetariano", "Sin lacteos", "Sin gluten"];

function toLines(val) {
  return (val || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
function toCSV(val) {
  return (val || "")
    .split(/[,;]\s*|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RecipeForm({
  initial = null,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [minutes, setMinutes] = useState("");
  const [servings, setServings] = useState("1");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("intermedio");
  const [meal, setMeal] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title || "");
    setImage(initial.image || "");
    setMinutes(String(initial.minutes ?? ""));
    setServings(String(initial._servings ?? "1"));
    setDescription(initial._description || "");
    setDifficulty((initial.difficulty || "intermedio").toLowerCase());
    setMeal(Array.isArray(initial.meal) ? initial.meal : (initial.meal ? [initial.meal] : []));
    setRestrictions(initial.restrictions || []);
    setIngredients((initial.ingredients || []).join("\n"));
    setInstructions((initial.instructions || []).join("\n"));
  }, [initial]);

  const valid = useMemo(() => {
    const e = {};
    if (!title.trim()) e.title = "Título requerido";
    const m = Number(minutes);
    if (!minutes || Number.isNaN(m) || m <= 0) e.minutes = "Minutos inválidos";
    const s = Number(servings);
    if (!servings || Number.isNaN(s) || s <= 0) e.servings = "Porciones inválidas";
    // Imagen no requerida al crear (backend la asigna), pero requerida al editar si se cambia
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [title, minutes, servings]);

  function toggleSet(arr, val) {
    const s = new Set(arr);
    s.has(val) ? s.delete(val) : s.add(val);
    return Array.from(s);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const payload = {
      name: title.trim(),
      image: image.trim(), // opcional en update
      cookTime: Number(minutes),
      servings: Number(servings),
      difficulty: String(difficulty).toLowerCase(),
      category: Array.isArray(meal) ? (meal[0] || "") : "",
      restrictions: restrictions.slice(),
      ingredients: toLines(ingredients),
      instructions: toLines(instructions),
      description: description.trim(),
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-inner" style={{ display:"grid", gap:16 }}>
        <div style={{ display:"grid", gap:8 }}>
          <label><strong>Título</strong></label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Nombre del plato" />
          {errors.title && <small style={{color:"var(--danger)"}}>{errors.title}</small>}
        </div>

        <div style={{ display:"grid", gap:8 }}>
          <label><strong>Descripción</strong></label>
          <textarea rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Breve descripción de la receta" />
        </div>

        <div style={{ display:"grid", gap:8 }}>
          <label><strong>Imagen (URL)</strong> <small>(opcional)</small></label>
          <input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          <div>
            <label><strong>Minutos</strong></label>
            <input type="number" min="1" value={minutes} onChange={(e)=>setMinutes(e.target.value)} />
            {errors.minutes && <small style={{color:"var(--danger)"}}>{errors.minutes}</small>}
          </div>
          <div>
            <label><strong>Porciones</strong></label>
            <input type="number" min="1" value={servings} onChange={(e)=>setServings(e.target.value)} />
            {errors.servings && <small style={{color:"var(--danger)"}}>{errors.servings}</small>}
          </div>
          <div>
            <label><strong>Dificultad</strong></label>
            <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
              {DIFFS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label><strong>Tipo (meal)</strong></label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {TYPES.map(t => (
                <label key={t} style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="checkbox" checked={meal.includes(t)} onChange={()=>setMeal(toggleSet(meal, t))}/>
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label><strong>Restricciones</strong></label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {RESTR.map(r => (
                <label key={r} style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="checkbox" checked={restrictions.includes(r)} onChange={()=>setRestrictions(toggleSet(restrictions, r))}/>
                  {r}
                </label>
              ))}
            </div>
            <details style={{marginTop:6}}>
              <summary>o escribe CSV</summary>
              <input placeholder="Vegetariano, Sin gluten..." onBlur={(e)=> setRestrictions(toCSV(e.target.value)) } />
            </details>
          </div>
        </div>

        <div style={{ display:"grid", gap:8 }}>
          <label><strong>Ingredientes</strong> <small>(1 por línea)</small></label>
          <textarea rows={6} value={ingredients} onChange={(e)=>setIngredients(e.target.value)} />
        </div>

        <div style={{ display:"grid", gap:8 }}>
          <label><strong>Pasos / Instrucciones</strong> <small>(1 por línea)</small></label>
          <textarea rows={8} value={instructions} onChange={(e)=>setInstructions(e.target.value)} />
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          {onCancel && <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>}
          <button className="btn" type="submit">{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}
