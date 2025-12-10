import { useEffect, useState } from "react";

const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"];

export default function AdminRecipeForm({ initial, onSubmit, onCancel, submitLabel = "Guardar" }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("1");
  const [difficulty, setDifficulty] = useState("Intermedio");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [restrictions, setRestrictions] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setDescription(initial.description || "");
      setImage(initial.image || "");
      setCookTime(String(initial.cookTime ?? ""));
      setServings(String(initial.servings ?? "1"));
      setDifficulty(initial.difficulty || "Intermedio");
      setCategory(initial.category || "");
      setIngredients(initial.ingredients || []);
      setInstructions(initial.instructions || []);
      setRestrictions(initial.restrictions || "");
    }
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name,
      description,
      image,
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      category,
      restrictions,
      ingredients,
      instructions,
    };
    onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
        <label>Título</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Imagen (URL)</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} />

        <label>Tiempo de cocción (minutos)</label>
        <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required />

        <label>Porciones</label>
        <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} required />

        <label>Dificultad</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <label>Categoría</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} required />

        <label>Ingredientes (uno por línea)</label>
        <textarea
          value={ingredients.join("\n")}
          onChange={(e) => setIngredients(e.target.value.split("\n").filter(Boolean))}
        />

        <label>Instrucciones (una por línea)</label>
        <textarea
          value={instructions.join("\n")}
          onChange={(e) => setInstructions(e.target.value.split("\n").filter(Boolean))}
        />

        <label>Restricciones</label>
        <input value={restrictions} onChange={(e) => setRestrictions(e.target.value)} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {onCancel && <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>}
          <button className="btn" type="submit">{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}
