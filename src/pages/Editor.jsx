import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../services/api";
import { resolveImageUrl } from "../services/images";
import EditorToolbar from "../components/EditorToolbar";
import AdminRecipeForm from "../components/AdminRecipeForm";

export default function Editor() {
  const { role, setRole, token } = useContext(AuthContext);
  const isAdmin = String(role).toLowerCase() === "admin";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getRecipes(token);
        setAll(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando recetas:", e);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) => r.name?.toLowerCase().includes(q));
  }, [all, query]);

  async function handleCreate(payload) {
    try {
      const created = await createRecipe(payload, token);
      setAll((prev) => [created, ...prev]);
      setEditing(null);
      alert("Receta creada correctamente");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear la receta");
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await updateRecipe(id, payload, token);
      setAll((prev) => prev.map((r) => (String(r.id) === String(id) ? updated : r)));
      setEditing(null);
      alert("Receta actualizada correctamente");
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar la receta");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta receta?")) return;
    try {
      await deleteRecipe(id, token);
      setAll((prev) => prev.filter((r) => String(r.id) !== String(id)));
      if (editing && String(editing.id) === String(id)) setEditing(null);
      alert("Receta eliminada correctamente");
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar la receta");
    }
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-inner" style={{ display: "grid", gap: 10 }}>
            <h1 className="page-title">Editor</h1>
            <p>Necesitas el rol <strong>admin</strong> para gestionar recetas.</p>
            <button className="btn" onClick={() => setRole("admin")}>Cambiar a Admin</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="editor" className="container">
      <h1 className="page-title">Editor de Recetas</h1>

      <EditorToolbar onNew={() => setEditing({})} query={query} setQuery={setQuery} />

      <div className="editor-layout">
        <section className="panel">
          <div className="panel-inner">
            {error && <div style={{ color: "var(--danger)", marginBottom: 10 }}>{error}</div>}
            {loading ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>Cargando…</div>
            ) : list.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>Sin resultados</div>
            ) : (
              <ul className="editor-list">
                {list.map((r) => {
                  const src = resolveImageUrl(r.image);
                  return (
                    <li key={r.id} className="editor-list-item">
                      <img src={src} alt={r.name} />
                      <div className="editor-list-item-meta">
                        {r.name}
                        <small>⏱ {r.cookTime} min · {r.difficulty}</small>
                      </div>
                      <div className="editor-list-item-actions">
                        <button className="btn-outline" onClick={() => setEditing(r)}>Editar</button>
                        <button className="btn-outline" onClick={() => handleDelete(r.id)}>Eliminar</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <aside>
          {editing ? (
            <AdminRecipeForm
              initial={editing?.id ? editing : null}
              onCancel={() => setEditing(null)}
              onSubmit={(payload) =>
                editing?.id ? handleUpdate(editing.id, payload) : handleCreate(payload)
              }
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
