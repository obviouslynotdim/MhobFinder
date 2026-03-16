import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { getMatchedFoods, getHomeFoods } from "../services/api/food.service.js";
import { getAllIngredients } from "../services/api/ingredient.service.js";
import { useUser } from "./UserProvider.jsx";

const AppCtx = createContext(null);

function countMatchingIngredients(food, selectedIngredientIds) {
  const selectedSet = new Set(selectedIngredientIds.map(Number));

  return (food.ingredients || []).reduce((count, ingredient) => {
    const ingredientId = Number(ingredient?.ingredient_id ?? ingredient);
    return selectedSet.has(ingredientId) ? count + 1 : count;
  }, 0);
}

function sortFoodsByMatchStrength(foods, selectedIngredientIds) {
  return [...foods].sort((leftFood, rightFood) => {
    const rightMatches = countMatchingIngredients(rightFood, selectedIngredientIds);
    const leftMatches = countMatchingIngredients(leftFood, selectedIngredientIds);

    if (rightMatches !== leftMatches) {
      return rightMatches - leftMatches;
    }

    return String(leftFood.title || "").localeCompare(String(rightFood.title || ""));
  });
}

export function AppProvider({ children }) {
  const { user } = useUser();

  const [ingredients, setIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(false);

  // Favorites per user
  const [favorites, setFavorites] = useState([]);

  const foodsReqIdRef = useRef(0);

  // -------------------------
  // Initial Load
  // -------------------------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [ingData, foodData] = await Promise.all([
          getAllIngredients(),
          getHomeFoods(),
        ]);

        setIngredients(ingData);
        setFoods(foodData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------
  // Load Favorites for User
  // -------------------------
  useEffect(() => {
    if (user?.id) {
      const stored = JSON.parse(
        localStorage.getItem(`mhob:favorites:${user.id}`) || "[]"
      );
      setFavorites(stored);
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  // -------------------------
  // Save Favorites
  // -------------------------
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `mhob:favorites:${user.id}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, user?.id]);

  // -------------------------
  // Refresh foods by ingredients
  // -------------------------
  const refreshFoods = useCallback(async (ids) => {
    const reqId = ++foodsReqIdRef.current;

    setFoodsLoading(true);

    try {
      const nextFoods = Array.isArray(ids) && ids.length > 0
        ? sortFoodsByMatchStrength(await getMatchedFoods(ids), ids)
        : await getHomeFoods({ forceRefresh: true });

      if (reqId === foodsReqIdRef.current) {
        setFoods(nextFoods);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (reqId === foodsReqIdRef.current) {
        setFoodsLoading(false);
      }
    }
  }, []);

  // -------------------------
  // Toggle Ingredient
  // -------------------------
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
    [refreshFoods]
  );

  // -------------------------
  // Clear Ingredients
  // -------------------------
  const clearIngredients = useCallback(() => {
    setSelectedIds([]);
    refreshFoods([]);
  }, [refreshFoods]);

  // -------------------------
  // Toggle Favorite
  // -------------------------
  const toggleFavorite = useCallback((foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((x) => x !== foodId)
        : [...prev, foodId]
    );
  }, []);

  // -------------------------
  // Search Filter
  // -------------------------
  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();

    return !q
      ? foods
      : foods.filter((f) => {
          const title = String(f.title || "").toLowerCase();
          const description = String(f.description || "").toLowerCase();
          const categories = Array.isArray(f.categories)
            ? f.categories.map((category) => String(category?.name || "").toLowerCase())
            : [];
          const ingredients = Array.isArray(f.ingredients)
            ? f.ingredients.map((ingredient) => String(ingredient?.name || "").toLowerCase())
            : [];

          return (
            title.includes(q) ||
            description.includes(q) ||
            categories.some((name) => name.includes(q)) ||
            ingredients.some((name) => name.includes(q))
          );
        });
  }, [foods, search]);

  // -------------------------
  // Context Value
  // -------------------------
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
      toggleIngredient,
      clearIngredients,
      toggleFavorite,
      refreshFoods,
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
      toggleIngredient,
      clearIngredients,
      toggleFavorite,
      refreshFoods,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// -------------------------
// Hook
// -------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppCtx);

  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return ctx;
};
