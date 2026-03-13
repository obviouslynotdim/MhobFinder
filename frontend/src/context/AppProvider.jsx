import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { getAllFoods, getMatchedFoods } from "../services/api/food.service.js";
import { getAllIngredients } from "../services/api/ingredient.service.js";
import { useUser } from "./UserProvider.jsx";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const { user } = useUser();
  const [ingredients, setIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foods, setFoods] = useState([]);
  // allFoods is the complete unfiltered catalogue — never mutated by ingredient filtering.
  const [allFoods, setAllFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(false);
  // Start empty; the effect below loads the correct user-scoped favorites.
  const [favorites, setFavorites] = useState([]);
  const foodsReqIdRef = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ingData, foodData] = await Promise.all([
          getAllIngredients(),
          getAllFoods(),
        ]);
        setIngredients(ingData);
        setFoods(foodData);
        setAllFoods(foodData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load favorites scoped to the current user; clear when logged out.
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(
        localStorage.getItem(`mhob:favorites:${user.id}`) || "[]",
      );
      setFavorites(stored);
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  // Persist favorites only for the logged-in user.
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `mhob:favorites:${user.id}`,
        JSON.stringify(favorites),
      );
    }
  }, [favorites, user?.id]);

  const refreshFoods = useCallback(async (ids) => {
    const reqId = ++foodsReqIdRef.current;
    setFoodsLoading(true);
    try {
      const matched = await getMatchedFoods(ids);
      if (reqId === foodsReqIdRef.current) setFoods(matched);
    } catch (e) {
      console.error(e);
    } finally {
      if (reqId === foodsReqIdRef.current) setFoodsLoading(false);
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
    return !q
      ? foods
      : foods.filter((f) => (f.title || "").toLowerCase().includes(q));
  }, [foods, search]);

  const value = useMemo(
    () => ({
      ingredients,
      selectedIds,
      foods: filteredFoods,
      rawFoods: foods,
      allFoods,
      favorites,
      search,
      setSearch,
      loading,
      foodsLoading,
      toggleIngredient,
      clearIngredients,
      toggleFavorite,
    }),
    [
      ingredients,
      selectedIds,
      filteredFoods,
      foods,
      allFoods,
      favorites,
      search,
      loading,
      foodsLoading,
      toggleIngredient,
      clearIngredients,
      toggleFavorite,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
