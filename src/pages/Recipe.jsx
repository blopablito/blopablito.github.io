import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
      
      {/* 1. IMAGEN MÁS GRANDE (450px) */}
      <div style={{ 
          width: "100%", 
          height: 450, // Aumentado para que se vea más grande
          borderRadius: "16px", 
          overflow: "hidden", 
          marginBottom: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
      }}>
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
      </div>

      {/* 2. CONTENEDOR DE INFORMACIÓN */}
      <div className="panel" style={{ padding: 30, color: "black" }}>
        
        <h1 style={{ fontSize: "2.5rem", marginBottom: 24, color: "black", fontWeight: "800" }}>
          {recipe.name}
        </h1>

        {/* 3. META INFO (2 Columnas) */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 24, 
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: "1px solid #eee"
        }}>
            <div>
                <small style={{ color: "#666", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1 }}>Tiempo</small>
                <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>{recipe.cookTime} min</div>
            </div>
            <div>
                <small style={{ color: "#666", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1 }}>Dificultad</small>
                <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>{recipe.difficulty}</div>
            </div>
            <div>
                <small style={{ color: "#666", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1 }}>Tipo</small>
                <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>{recipe.category}</div>
            </div>
            <div>
                <small style={{ color: "#666", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1 }}>Porciones</small>
                <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>{recipe.servings}</div>
            </div>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: "1.4rem", marginBottom: 12, color: "black" }}>Descripción</h3>
          <p style={{ lineHeight: 1.8, fontSize: "1.05rem", color: "#333" }}>{recipe.description}</p>
        </div>

        {/* ETIQUETAS (Blanco con borde negro) */}
        {recipe.restrictions && recipe.restrictions.length > 0 && (
          <div style={{ marginBottom: 32 }}>
              <h4 style={{ marginBottom: 12, color: "black", fontSize: "1.1rem" }}>Etiquetas:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {recipe.restrictions.map((tag, idx) => (
                      <span key={idx} style={{
                          backgroundColor: "white",     // Fondo blanco
                          color: "black",               // Letra negra
                          border: "1px solid black",    // Borde negro
                          padding: "6px 16px",
                          borderRadius: 20,
                          fontSize: "0.9rem",
                          fontWeight: "600"
                      }}>
                          {tag}
                      </span>
                  ))}
              </div>
          </div>
        )}

        {/* GRID: Ingredientes e Instrucciones */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          
          {/* Ingredientes (Con cuadro blanco individual) */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 10, marginBottom: 20, color: "black", fontSize: "1.4rem" }}>Ingredientes</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ 
                    padding: "14px 16px", 
                    backgroundColor: "#fff",       // Cuadro blanco
                    border: "1px solid #e0e0e0",   // Borde suave
                    borderRadius: 10,              // Bordes redondeados
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "black",
                    fontSize: "1rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "black", flexShrink: 0 }}></div>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instrucciones (Con cuadro blanco individual) */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 10, marginBottom: 20, color: "black", fontSize: "1.4rem" }}>Instrucciones</h3>
            <div style={{ display: "grid", gap: 16 }}>
              {recipe.instructions.map((step, i) => (
                <div key={i} style={{ 
                    padding: "16px",
                    backgroundColor: "#fff",       // Cuadro blanco
                    border: "1px solid #e0e0e0",   // Borde suave
                    borderRadius: 10,
                    display: "flex", 
                    gap: 16,
                    alignItems: "flex-start",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                }}>
                  <div style={{ 
                      background: "black", 
                      color: "white", 
                      width: 28, 
                      height: 28, 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: "bold",
                      flexShrink: 0,
                      fontSize: 14,
                      marginTop: 2
                  }}>
                      {i + 1}
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.6, color: "#333", fontSize: "1rem" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Comments recipeId={recipe.id} />
    </div>
  );
}