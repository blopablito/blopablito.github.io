// src/components/AdminRecipeForm.jsx
import { useEffect, useState } from "react";

const DISPLAY_DIFFICULTIES = ["fácil", "media", "difícil"];

// Mapea valores del backend (en o es) a los visibles en el select
function toDisplayDifficulty(val) {
  const v = String(val || "").toLowerCase();
  if (["fácil", "easy"].includes(v)) return "fácil";
  if (["media", "intermedio", "medium"].includes(v)) return "media";
  if (["difícil", "dificil", "hard"].includes(v)) return "difícil";
  return "media";
}

// Mapea los visibles a los que espera el backend (ajusta si tu backend usa español)
function toWireDifficulty(val) {
  const v = String(val || "").toLowerCase();
  if (v === "fácil") return "easy";      // cambia a "fácil" si tu backend usa español
  if (v === "media") return "medium";    // o "intermedio" si tu backend lo exige
  if (v === "difícil") return "hard";
  return "medium";
}

export default function AdminRecipeForm({
  initial = null,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("1");
  const [difficulty, setDifficulty] = useState("media"); // visible
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initial) return;
    setName(initial.name || "");
    setDescription(initial.description || "");
    setImage(initial.image || "");
    setCookTime(String(initial.cookTime ?? ""));
    setServings(String(initial.servings ?? "1"));
    setDifficulty(toDisplayDifficulty(initial.difficulty)); // normaliza a visible
    setCategory(initial.category || "");
    setIngredients(Array.isArray(initial.ingredients) ? initial.ingredients : []);
    setInstructions(Array.isArray(initial.instructions) ? initial.instructions : []);
    setRestrictions(Array.isArray(initial.restrictions) ? initial.restrictions : []);
  }, [initial]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Título requerido";
    const m = Number(cookTime);
    if (!cookTime || Number.isNaN(m) || m <= 0) e.cookTime = "Minutos inválidos";
    const s = Number(servings);
    if (!servings || Number.isNaN(s) || s <= 0) e.servings = "Porciones inválidas";
    // No bloqueamos por dificultad aquí; la normalizamos al enviar
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty: toWireDifficulty(difficulty), // normalizado para backend
      category: category.trim(),
      ingredients: ingredients.filter(Boolean),
      instructions: instructions.filter(Boolean),
      restrictions: restrictions.map((r) => String(r).toLowerCase()).filter(Boolean),
    };

    onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Título</strong></label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del plato" />
          {errors.name && <small style={{ color: "var(--danger)" }}>{errors.name}</small>}
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Descripción</strong></label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción" />
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
              {DISPLAY_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Categoría</strong></label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Desayuno, Almuerzo..." />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Ingredientes</strong> <small>(1 por línea)</small></label>
          <textarea
            rows={6}
            value={ingredients.join("\n")}
            onChange={(e) => setIngredients(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Pasos / Instrucciones</strong> <small>(1 por línea)</small></label>
          <textarea
            rows={8}
            value={instructions.join("\n")}
            onChange={(e) => setInstructions(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label><strong>Restricciones</strong> <small>(1 por línea)</small></label>
          <textarea
            rows={4}
            value={restrictions.join("\n")}
            onChange={(e) => setRestrictions(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {onCancel && <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>}
          <button className="btn" type="submit">{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}
