import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../services/api";
import Comments from "../components/Comments";

export default function Recipe() {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipeById(id);
        setReceta(data);
      } catch (e) {
        console.error("Error cargando receta:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  if (!receta) {
    return <div className="container">Receta no encontrada</div>;
  }

  return (
    <div id="recipe" className="container">
      <div className="hero">
        <div className="image">
          <img
            src={receta.image}
            alt={receta.name}
            style={{ width: "100%", borderRadius: 18 }}
          />
        </div>

        <div className="panel">
          <div className="panel-inner">
            <h1 className="page-title">{receta.name}</h1>

            <p>
              <strong>Tiempo:</strong> {receta.cookTime} min
            </p>
            <p>
              <strong>Porciones:</strong> {receta.servings}
            </p>
            <p>
              <strong>Dificultad:</strong> {receta.difficulty}
            </p>
            <p>
              <strong>Tipo:</strong> {receta.category}
            </p>
            <p>
              <strong>Descripción:</strong> {receta.description}</p>

            <h3 className="section-title">Ingredientes</h3>
            <ul>
              {receta.ingredients?.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <h3 className="section-title">Preparación</h3>
            <ol>
              {receta.instructions?.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <Comments recipeId={id} />
    </div>
  );
}
