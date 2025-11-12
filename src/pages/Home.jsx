// ...importaciones
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [favIds, setFavIds] = useState(() => (user ? getFavIds(user.id) : []));

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

  useEffect(() => {
    if (user) setFavIds(getFavIds(user.id));
  }, [user]);

  const filtered = useMemo(() => {
    let list = recipes;
    const q = query.trim().toLowerCase();

    if (q) list = list.filter((r) =>
      r.name?.toLowerCase().includes(q) ||
      r.ingredients?.some?.((i) => i.toLowerCase().includes(q))
    );

    if (filters.time?.length)
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

    if (filters.difficulty?.length)
      list = list.filter((r) =>
        filters.difficulty.includes(r.difficulty?.toLowerCase?.())
      );

    if (filters.type?.length)
      list = list.filter((r) =>
        filters.type.includes(r.category)
      );

    if (filters.restrictions?.length)
      list = list.filter((r) =>
        filters.restrictions.every((s) => r.restrictions?.includes?.(s))
      );

    return list;
  }, [recipes, query, filters]);

  const handleFav = (receta) => {
    if (!user) return alert("Inicia sesión para guardar favoritos");
    const { ids } = toggleFav(user.id, receta);
    setFavIds(ids);
  };

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
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          Cargando recetas...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          No se encontraron recetas
        </div>
      ) : (
        <div className="recipes-grid">
          {filtered.map((rec) => (
            <RecipeCard
              key={rec._id}
              receta={rec}
              onFav={handleFav}
              isFav={favIds.includes(String(rec._id))}
            />
          ))}
        </div>
      )}
    </>
  );

  const right = <Filters value={filters} onChange={setFilters} />;

  return <Board id="home" header={header} left={left} right={right} />;
}
