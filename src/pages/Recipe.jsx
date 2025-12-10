import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeById } from "../services/api";
import { AuthContext } from "../store/authContext";
import Comments from "../components/Comments";

export default function Recipe() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipeById(id, token)
      .then(setRecipe)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="container" style={{padding: 20}}>Cargando...</div>;
  if (!recipe) return <div className="container" style={{padding: 20}}>Receta no encontrada</div>;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="panel" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ width: "100%", height: 300, backgroundColor: "#eee" }}>
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
        </div>

        <div className="panel-inner" style={{ padding: 24 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 16, color: "var(--primary)" }}>
            {recipe.name}
          </h1>

          <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 16, 
              marginBottom: 20, 
              padding: 16, 
              background: "#f8f9fa", 
              borderRadius: 12 
          }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 20 }}>⏱</span>
                  <div>
                      <small style={{ color: "#666", display: "block" }}>Tiempo</small>
                      <strong>{recipe.cookTime} min</strong>
                  </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <div>
                      <small style={{ color: "#666", display: "block" }}>Dificultad</small>
                      <strong>{recipe.difficulty}</strong>
                  </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 20 }}>🍲</span>
                  <div>
                      <small style={{ color: "#666", display: "block" }}>Tipo</small>
                      <strong>{recipe.category}</strong>
                  </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 20 }}>👥</span>
                  <div>
                      <small style={{ color: "#666", display: "block" }}>Porciones</small>
                      <strong>{recipe.servings}</strong>
                  </div>
              </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 10 }}>Descripción</h3>
            <p style={{ lineHeight: 1.6, color: "#444" }}>{recipe.description}</p>
          </div>

          {recipe.restrictions && recipe.restrictions.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8, color: "#666" }}>Etiquetas:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {recipe.restrictions.map((tag, idx) => (
                        <span key={idx} style={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            padding: "4px 12px",
                            borderRadius: 16,
                            fontSize: "0.9rem",
                            fontWeight: "500"
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <div>
              <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 16 }}>Ingredientes</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} style={{ 
                      padding: "8px 12px", 
                      background: "#fff", 
                      border: "1px solid #eee", 
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 10
                  }}>
                    <span style={{ color: "var(--primary)", fontWeight: "bold" }}>•</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 16 }}>Instrucciones</h3>
              <div style={{ display: "grid", gap: 16 }}>
                {recipe.instructions.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ 
                        background: "var(--primary)", 
                        color: "white", 
                        width: 28, 
                        height: 28, 
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontWeight: "bold",
                        flexShrink: 0,
                        fontSize: 14
                    }}>
                        {i + 1}
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.5, color: "#333" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Comments recipeId={recipe.id} />
    </div>
  );
}