// src/components/AdminRecipeForm.jsx
import { useEffect, useMemo, useState } from "react";

const DIFFICULTIES = ["fácil", "media", "difícil"];

// 🔎 Normaliza dificultad entre frontend y backend
function normalizeDifficulty(val) {
  const map = {
    fácil: "easy",
    media: "medium",
    intermedio: "medium",
    difícil: "hard",
    easy: "easy",
    medium: "medium",
    hard: "hard",
  };
  return map[String(val).toLowerCase()] || "medium";
}

export default function AdminRecipeForm({
  initial = null,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("1");
  const [difficulty, setDifficulty] = useState("media");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [errors, setErrors] = useState({});

  // 🔎 Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (!initial) return;
    setName(initial.name || "");
    setDescription(initial.description || "");
    setImage(initial.image || "");
    setCookTime(String(initial.cookTime ?? ""));
    setServings(String(initial.servings ?? "1"));
    setDifficulty(initial.difficulty || "media");
    setCategory(initial.category || "");
    setIngredients(initial.ingredients || []);
    setInstructions(initial.instructions || []);
    setRestrictions(initial.restrictions || []);
  }, [initial]);

  // 🔎 Validación
  const valid = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Título requerido";
    const m = Number(cookTime);
    if (!cookTime || Number.isNaN(m) || m <= 0) e.cookTime = "Minutos inválidos";
    const s = Number(servings);
    if (!servings || Number.isNaN(s) || s <= 0) e.servings = "Porciones inválidas";

    // Normalizamos antes de validar
    const diff = normalizeDifficulty(difficulty);
    if (!["easy", "medium", "hard"].includes(diff)) {
      e.difficulty = "Dificultad inválida";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, cookTime, servings, difficulty]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty: normalizeDifficulty(difficulty), // 🔎 aquí ya normalizado
      category: category.trim(),
      ingredients,
      instructions,
      restrictions,
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Título</strong></label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <small style={{ color: "var(--danger)" }}>{errors.name}</small>}
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Descripción</strong></label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Imagen (URL)</strong></label>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div>
            <label><strong>Minutos</strong></label>
            <input type="number" min="1" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
            {errors.cookTime && <small style={{ color: "var(--danger)" }}>{errors.cookTime}</small>}
          </div>
          <div>
            <label><strong>Porciones</strong></label>
            <input type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
            {errors.servings && <small style={{ color: "var(--danger)" }}>{errors.servings}</small>}
          </div>
          <div>
            <label><strong>Dificultad</strong></label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.difficulty && <small style={{ color: "var(--danger)" }}>{errors.difficulty}</small>}
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Categoría</strong></label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        {/* Ingredientes */}
        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Ingredientes</strong></label>
          <textarea rows={6} value={ingredients.join("\n")} onChange={(e) => setIngredients(e.target.value.split("\n").filter(Boolean))} />
        </div>

        {/* Instrucciones */}
        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Pasos / Instrucciones</strong></label>
          <textarea rows={8} value={instructions.join("\n")} onChange={(e) => setInstructions(e.target.value.split("\n").filter(Boolean))} />
        </div>

        {/* Restricciones */}
        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Restricciones</strong></label>
          <textarea rows={4} value={restrictions.join("\n")} onChange={(e) => setRestrictions(e.target.value.split("\n").filter(Boolean))} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {onCancel && <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>}
          <button className="btn" type="submit">Guardar</button>
        </div>
      </div>
    </form>
  );
}
