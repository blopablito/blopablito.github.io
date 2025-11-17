import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/authContext";
import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from "../services/api";
import AdminRecipeForm from "../components/AdminRecipeForm";
import Toast from "../components/Toast";

export default function AdminRecipes() {
  const { role } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); 
  const [creating, setCreating] = useState(false); 
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getRecipes();
      setList(data);
    } catch (e) {
      console.error(e);
      setErrorMsg("No se pudieron cargar las recetas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (role !== "admin") {
    return (
      <div className="container">
        <h1 className="page-title">Administración</h1>
        <div className="panel"><div className="panel-inner">No tienes permisos para editar recetas.</div></div>
      </div>
    );
  }

  const handleCreate = async (payload) => {
    try {
      const r = await createRecipe(payload);
      setToastMsg("Receta creada correctamente");
      setCreating(false);
      setList((prev) => [r, ...prev]);
    } catch (e) {
      console.error(e);
      setToastMsg("No se pudo crear la receta");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const r = await updateRecipe(editing.id, payload);
      setToastMsg("Cambios guardados");
      setEditing(null);
      setList((prev) => prev.map((x) => (x.id === r.id ? r : x)));
    } catch (e) {
      console.error(e);
      setToastMsg("No se pudo guardar los cambios");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta receta?")) return;
    try {
      await deleteRecipe(id);
      setToastMsg("Receta eliminada");
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      setToastMsg("No se pudo eliminar la receta");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Administración de recetas</h1>

      <div className="panel">
        <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!creating && !editing && (
              <button className="btn" onClick={() => setCreating(true)}>Nueva receta</button>
            )}
            {(creating || editing) && (
              <button className="btn-outline" onClick={() => { setCreating(false); setEditing(null); }}>
                Salir de edición
              </button>
            )}
            <button className="btn-outline" onClick={load}>Recargar</button>
          </div>

          {creating && (
            <div className="subpanel">
              <h3>Crear receta</h3>
              <AdminRecipeForm
                initial={null}
                onSubmit={handleCreate}
                onCancel={() => setCreating(false)}
              />
            </div>
          )}

          {editing && (
            <div className="subpanel">
              <h3>Editar receta</h3>
              <AdminRecipeForm
                initial={editing}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}

          {loading && <div style={{ color: "var(--muted)" }}>Cargando…</div>}
          {errorMsg && <div style={{ color: "var(--danger)" }}>{errorMsg}</div>}

          {!loading && !errorMsg && (
            <div style={{ display: "grid", gap: 12 }}>
              {list.map((r) => (
                <div key={r.id} className="recipe-row" style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={r.image} alt={r.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <strong>{r.name}</strong>
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>
                        {r.category} · {r.difficulty} · {r.cookTime} min · {r.servings} porciones
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-outline" onClick={() => setEditing(r)}>Editar</button>
                      <button className="btn-outline" onClick={() => handleDelete(r.id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}
