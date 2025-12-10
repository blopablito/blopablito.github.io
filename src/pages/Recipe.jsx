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
      
      {/* 1. IMAGEN SEPARADA (Fuera del panel de info) */}
      <div style={{ 
          width: "100%", 
          height: 300, 
          borderRadius: "16px", 
          overflow: "hidden", 
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
      }}>
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
      </div>

      {/* 2. INFORMACIÓN (Letras Negras) */}
      <div className="panel" style={{ padding: 24, color: "black" }}>
        
        <h1 style={{ fontSize: "2rem", marginBottom: 20, color: "black" }}>
          {recipe.name}
        </h1>

        {/* 3. META INFO (2 Columnas, Sin Iconos, Sin Cuadro Blanco) */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", // 2 Columnas
            gap: 20, 
            marginBottom: 30,
            color: "black"
        }}>
            <div>
                <small style={{ color: "#555", fontSize: "0.9rem", textTransform: "uppercase", fontWeight: "bold" }}>Tiempo</small>
                <div style={{ fontSize: "1.1rem" }}>{recipe.cookTime} min</div>
            </div>
            <div>
                <small style={{ color: "#555", fontSize: "0.9rem", textTransform: "uppercase", fontWeight: "bold" }}>Dificultad</small>
                <div style={{ fontSize: "1.1rem" }}>{recipe.difficulty}</div>
            </div>
            <div>
                <small style={{ color: "#555", fontSize: "0.9rem", textTransform: "uppercase", fontWeight: "bold" }}>Tipo</small>
                <div style={{ fontSize: "1.1rem" }}>{recipe.category}</div>
            </div>
            <div>
                <small style={{ color: "#555", fontSize: "0.9rem", textTransform: "uppercase", fontWeight: "bold" }}>Porciones</small>
                <div style={{ fontSize: "1.1rem" }}>{recipe.servings}</div>
            </div>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 10, color: "black" }}>Descripción</h3>
          <p style={{ lineHeight: 1.6, color: "black" }}>{recipe.description}</p>
        </div>

        {/* Etiquetas (Tags) */}
        {recipe.restrictions && recipe.restrictions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8, color: "black" }}>Etiquetas:</h4>
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

        {/* Ingredientes y Pasos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {/* Ingredientes */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 16, color: "black" }}>Ingredientes</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ 
                    padding: "8px 0", 
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    gap: 10,
                    color: "black"
                }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instrucciones */}
          <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: 8, marginBottom: 16, color: "black" }}>Instrucciones</h3>
            <div style={{ display: "grid", gap: 16 }}>
              {recipe.instructions.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ 
                      background: "black", 
                      color: "white", 
                      width: 24, 
                      height: 24, 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: "bold",
                      flexShrink: 0,
                      fontSize: 12,
                      marginTop: 2
                  }}>
                      {i + 1}
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.5, color: "black" }}>{step}</p>
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