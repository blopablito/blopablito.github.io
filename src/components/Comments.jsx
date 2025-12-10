import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/authContext";
import { getComments, addComment, deleteComment } from "../services/api";

export default function Comments({ recipeId }) {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canComment = Boolean(user && user.id);

  const loadComments = async () => {
    if (!recipeId) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getComments(String(recipeId));
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setErrorMsg("No se pudieron cargar los comentarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();

  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canComment) return;

    const text = content.trim();
    if (!text) return;

    setPosting(true);
    try {
      await addComment(String(recipeId), {
        content: text,
        userId: user.id, 
      });
      setContent("");
      await loadComments();
    } catch (err) {
      console.error("Error creando comentario:", err);
      alert("No se pudo publicar el comentario.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!canComment) return;
    if (!window.confirm("¿Eliminar este comentario?")) return;

    setDeletingId(commentId);
    try {
      await deleteComment(String(commentId), user.id);
      await loadComments();
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      alert("No se pudo eliminar el comentario.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="panel" style={{ marginTop: 24 }}>
      <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Comentarios</h2>

        {canComment ? (
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: 8 }}
          >
            <label style={{ fontWeight: 600 }}>Escribe un comentario</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte tu opinión o tips sobre esta receta…"
              style={{
                width: "100%",
                resize: "vertical",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,.18)",
                padding: "8px 10px",
                fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn"
                disabled={posting}
              >
                {posting ? "Publicando…" : "Publicar comentario"}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Inicia sesión para dejar un comentario.
          </div>
        )}

        {loading && (
          <div style={{ color: "var(--muted)" }}>Cargando…</div>
        )}

        {errorMsg && (
          <div style={{ color: "var(--danger)" }}>{errorMsg}</div>
        )}

        {!loading && !errorMsg && items.length === 0 && (
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Aún no hay comentarios. ¡Sé la primera persona en comentar! 🍽️
          </div>
        )}

        {!loading && !errorMsg && items.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 10,
            }}
          >
            {items.map((c) => {
              const author = c.users?.username || "Usuario";
              const isOwner = user && user.id && c.users?.id === user.id;
              const date = c.created_at
                ? new Date(c.created_at).toLocaleString()
                : "";

              return (
                <li
                  key={c.id}
                  style={{
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.06)",
                    padding: 10,
                    background: "#fff",
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--coffee)",
                      }}
                    >
                      {author}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {date}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {c.content}
                  </div>

                  {isOwner && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 4,
                      }}
                    >
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ fontSize: 12, padding: "4px 8px" }}
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? "Eliminando…" : "Eliminar"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
