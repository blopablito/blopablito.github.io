import { useEffect, useMemo, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";
import { getRecipes, getUserFavorites } from "../services/api"; 
import { AuthContext } from "../store/authContext";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { user, token } = useContext(AuthContext);
  const [favIds, setFavIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getRecipes();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando recetas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadFavorites = useCallback(async () => {
    if (user && token) {
        try {
            const favs = await getUserFavorites(user.id, token);
            const ids = favs.map(r => String(r.id));
            setFavIds(ids);
        } catch (e) {
            console.error("Error cargando favoritos", e);
        }
    } else {
        setFavIds([]);
    }
  }, [user, token]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavChange = async () => {
     await loadFavorites();
  };

  const filtered = useMemo(() => {
    let list = recipes;
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.ingredients?.some?.((i) => i.toLowerCase().includes(q))
      );
    }

    if (filters.time?.length) {
      list = list.filter((r) => {
        const t = Number(r.cookTime);
        return filters.time.some((f) => {
          if (f === "15-30") return t >= 15 && t <= 30;
          if (f === "30-45") return t > 30 && t <= 45;
          if (f === "45-60") return t > 45 && t <= 60;
          if (f === "60+") return t > 60;
          return true;
        });
      });
    }

    if (filters.difficulty?.length) {
      list = list.filter((r) =>
        filters.difficulty.includes(String(r.difficulty).toLowerCase())
      );
    }

    if (filters.type?.length) {
      list = list.filter((r) => filters.type.includes(r.category));
    }

    if (filters.restrictions?.length) {
      list = list.filter((r) =>
        filters.restrictions.every((s) => r.restrictions?.includes?.(s))
      );
    }

    return list;
  }, [recipes, query, filters]);

  const header = (
    <SearchBar
      value={query}
      onChange={setQuery}
      onSubmit={setQuery}
      placeholder="Buscar recetas o ingredientes"
    />
  );

  const left = (
    <>
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--muted)",
          }}
        >
          Cargando recetas...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--muted)",
          }}
        >
          No se encontraron recetas
        </div>
      ) : (
        <div className="recipes-grid">
          {filtered.map((rec) => (
            <RecipeCard
              key={rec.id}
              receta={rec}
              onFav={handleFavChange} 
              isFav={favIds.includes(String(rec.id))} 
            />
          ))}
        </div>
      )}
    </>
  );

  const right = <Filters value={filters} onChange={setFilters} />;

  return <Board id="home" header={header} left={left} right={right} />;
}