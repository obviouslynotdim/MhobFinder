import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// Import your controllers directly
import { getAllFoods, getMatchedFoods } from "../../../controllers/food.controller.js";
import { getAllIngredients } from "../../../controllers/ingredient.controller.js";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodsLoading, setFoodsLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mhob:favorites") || "[]");
    } catch {
      return [];
    }
  });

  const foodsReqIdRef = useRef(0);

  // Initial Load using imported functions instead of axios
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Call the controller functions directly
        const [ingData, foodData] = await Promise.all([
          getAllIngredients(),
          getAllFoods(),
        ]);

        setIngredients(ingData);
        setFoods(foodData);
      } catch (e) {
        console.error("Initial load failed:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem("mhob:favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Updated to use the local matching logic
  const refreshFoods = useCallback(async (ids) => {
    const reqId = ++foodsReqIdRef.current;

    try {
      setFoodsLoading(true);
      // Call local filtering logic instead of axios.post
      const matchedResults = await getMatchedFoods(ids);

      if (reqId === foodsReqIdRef.current) {
        setFoods(matchedResults);
      }
    } catch (e) {
      setError(e);
    } finally {
      if (reqId === foodsReqIdRef.current) {
        setFoodsLoading(false);
      }
    }
  }, []);

  const toggleIngredient = useCallback(
    (id) => {
      setSelectedIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id];
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
    [ingredients, selectedIds, filteredFoods, foods, favorites, search, loading, foodsLoading, error, toggleIngredient, clearIngredients, toggleFavorite],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}