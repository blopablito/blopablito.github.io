// src/pages/Editor.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../services/api";
import { resolveImageUrl } from "../services/images";
import EditorToolbar from "../components/EditorToolbar";
import RecipeForm from "../components/RecipeForm";

export default function Editor() {
  const { role, setRole } = useContext(AuthContext);
  const isEditor = String(role).toLowerCase() === "editor";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // objeto receta o null para crear

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getRecipes();
        setAll(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando recetas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) => r.title?.toLowerCase().includes(q));
  }, [all, query]);

  async function handleCreate(payload) {
    try {
      const created = await createRecipe(payload);
      setAll((prev) => [created, ...prev]);
      setEditing(null);
      alert("Receta creada");
    } catch (e) {
      alert("No se pudo crear la receta");
      console.error(e);
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await updateRecipe(id, payload);
      setAll((prev) => prev.map((r) => (String(r.id) === String(id) ? updated : r)));
      setEditing(null);
      alert("Receta actualizada");
    } catch (e) {
      alert("No se pudo actualizar la receta");
      console.error(e);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta receta?")) return;
    try {
      await deleteRecipe(id);
      setAll((prev) => prev.filter((r) => String(r.id) !== String(id)));
      if (editing && String(editing.id) === String(id)) setEditing(null);
      alert("Receta eliminada");
    } catch (e) {
      alert("No se pudo eliminar la receta");
      console.error(e);
    }
  }

  if (!isEditor) {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-inner" style={{ display: "grid", gap: 10 }}>
            <h1 className="page-title">Editor</h1>
            <p>
              Necesitas el rol <strong>editor</strong> para gestionar recetas.
            </p>
            <button className="btn" onClick={() => setRole("editor")}>
              Cambiar a Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="editor" className="container">
      <h1 className="page-title">Editor de Recetas</h1>

      {/* Barra superior: nuevo + búsqueda */}
      <EditorToolbar onNew={() => setEditing({})} query={query} setQuery={setQuery} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 24, alignItems: "start" }}>
        {/* Lista */}
        <section className="panel">
          <div className="panel-inner">
            {loading ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>Cargando…</div>
            ) : list.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>Sin resultados</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
                {list.map((r) => {
                  const src = resolveImageUrl(r.image);
                  return (
                    <li
                      key={r.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "64px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        border: "1px solid rgba(0,0,0,.06)",
                        borderRadius: 12,
                        padding: 8,
                        background: "#fff",
                      }}
                    >
                      <img
                        src={src}
                        alt={r.title}
                        style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 8 }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: "var(--coffee)" }}>{r.title}</div>
                        <small style={{ color: "var(--muted)" }}>
                          ⏱ {r.minutes} min · {r.difficulty}
                        </small>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-outline" onClick={() => setEditing(r)}>
                          Editar
                        </button>
                        <button className="btn-outline" onClick={() => handleDelete(r.id)}>
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Formulario (crear/editar) */}
        <aside>
          {editing ? (
            <RecipeForm
              initial={editing && editing.id ? editing : null}
              onCancel={() => setEditing(null)}
              onSubmit={(payload) => (editing?.id ? handleUpdate(editing.id, payload) : handleCreate(payload))}
              submitLabel={editing?.id ? "Actualizar" : "Crear receta"}
            />
          ) : (
            <div className="panel">
              <div className="panel-inner" style={{ color: "var(--muted)" }}>
                Selecciona una receta para editar o pulsa <strong>“Nueva receta”</strong>.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
