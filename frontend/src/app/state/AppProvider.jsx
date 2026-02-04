import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  // initial data loading (ingredients + default foods)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // loading state for the "match foods" request fired when toggling ingredients
  const [foodsLoading, setFoodsLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mhob:favorites") || "[]");
    } catch {
      return [];
    }
  });

  // Prevent "older response overwrites newer response"
  const foodsReqIdRef = useRef(0);

  // Prevent double-fetch issues in React StrictMode dev

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const [ing, food] = await Promise.all([
          axios.get("/api/ingredients", { signal: controller.signal }),
          axios.get("/api/foods", { signal: controller.signal }),
        ]);

        setIngredients(ing.data);
        setFoods(food.data);
      } catch (e) {
        // Ignore abort errors (happen in StrictMode dev)
        if (e?.name !== "CanceledError" && e?.name !== "AbortError") {
          console.error("Initial load failed:", e);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem("mhob:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const refreshFoods = useCallback(async (ids) => {
    const reqId = ++foodsReqIdRef.current;

    try {
      setFoodsLoading(true);
      const res = await axios.post("/api/foods/match", { ingredients: ids });

      // only accept the latest request's result
      if (reqId === foodsReqIdRef.current) {
        setFoods(res.data);
      }
    } catch (e) {
      // Optional: surface this error in UI
      setError(e);
    } finally {
      // only clear loading if this request is still the latest one
      if (reqId === foodsReqIdRef.current) {
        setFoodsLoading(false);
      }
    }
  }, []);

  // ✅ Stale-safe: compute next selection from previous state
  const toggleIngredient = useCallback(
    (id) => {
      setSelectedIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id];

        // fire async refresh (don’t await inside state setter)
        refreshFoods(next);
        return next;
      });
    },
    [refreshFoods],
  );

  const clearIngredients = useCallback(() => {
    setSelectedIds([]);
    refreshFoods([]);
  }, [refreshFoods]);

  const toggleFavorite = useCallback((foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((x) => x !== foodId)
        : [...prev, foodId],
    );
  }, []);

  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((f) => (f.title || "").toLowerCase().includes(q));
  }, [foods, search]);

  // ✅ Memoize context value to reduce rerenders
  const value = useMemo(
    () => ({
      ingredients,
      selectedIds,
      foods: filteredFoods,
      rawFoods: foods,
      favorites,
      search,
      setSearch,

      loading,
      foodsLoading,
      error,

      toggleIngredient,
      clearIngredients,
      toggleFavorite,
    }),
    [
      ingredients,
      selectedIds,
      filteredFoods,
      foods,
      favorites,
      search,
      loading,
      foodsLoading,
      error,
      toggleIngredient,
      clearIngredients,
      toggleFavorite,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
