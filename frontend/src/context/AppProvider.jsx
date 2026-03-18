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
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../services/api/favorite.service.js";
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
  const favoritesReqSeqRef = useRef(new Map());

  const resolveFavoriteCacheKey = useCallback(() => {
    if (user?.dbUserId) {
      return `mhob:favorites:${user.dbUserId}`;
    }

    if (user?.id) {
      return `mhob:favorites:${user.id}`;
    }

    return null;
  }, [user?.dbUserId, user?.id]);

  const readCachedFavorites = useCallback(() => {
    const keys = [];

    if (user?.dbUserId) {
      keys.push(`mhob:favorites:${user.dbUserId}`);
    }

    if (user?.id) {
      keys.push(`mhob:favorites:${user.id}`);
    }

    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw == null) {
          continue;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);
        }
      } catch {
        // Ignore invalid cached content and keep searching.
      }
    }

    return [];
  }, [user?.dbUserId, user?.id]);

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
    let active = true;

    if (!user?.id) {
      setFavorites([]);
      return () => {
        active = false;
      };
    }

    const hydrateFavorites = async () => {
      const cachedFavorites = readCachedFavorites();

      if (cachedFavorites.length > 0) {
        setFavorites(cachedFavorites);
      } else {
        setFavorites([]);
      }

      if (!user?.dbUserId) {
        return;
      }

      try {
        const serverFavorites = await getUserFavorites(user.dbUserId);
        if (!active) return;

        const normalized = Array.isArray(serverFavorites)
          ? serverFavorites
            .map((food) => Number(food?.food_id))
            .filter((id) => Number.isInteger(id) && id > 0)
          : [];

        // One-time migration path: preserve pre-server local favorites by
        // backfilling them when server currently has none.
        if (normalized.length === 0 && cachedFavorites.length > 0) {
          const uniqueCached = Array.from(new Set(cachedFavorites));
          await Promise.all(
            uniqueCached.map((foodId) => addFavorite(user.dbUserId, foodId).catch(() => null)),
          );
          if (!active) return;
          setFavorites(uniqueCached);
          return;
        }

        setFavorites(normalized);
      } catch (error) {
        if (!active) return;
        console.error("Failed to load server favorites, using local cache.", error);
      }
    };

    hydrateFavorites();

    return () => {
      active = false;
    };
  }, [readCachedFavorites, user?.dbUserId, user?.id]);

  // -------------------------
  // Save Favorites
  // -------------------------
  useEffect(() => {
    const cacheKey = resolveFavoriteCacheKey();
    if (!cacheKey) return;

    localStorage.setItem(cacheKey, JSON.stringify(favorites));
  }, [favorites, resolveFavoriteCacheKey]);

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
  const toggleFavorite = useCallback(async (foodId) => {
    const normalizedFoodId = Number(foodId);
    if (!Number.isInteger(normalizedFoodId) || normalizedFoodId <= 0) {
      return false;
    }

    let previousFavorites = [];
    let nextFavorites = [];
    let alreadyFavorite = false;

    setFavorites((prev) => {
      previousFavorites = prev;
      alreadyFavorite = prev.includes(normalizedFoodId);
      nextFavorites = alreadyFavorite
        ? prev.filter((id) => id !== normalizedFoodId)
        : [...prev, normalizedFoodId];

      return nextFavorites;
    });

    if (!user?.dbUserId) {
      return true;
    }

    const nextSeq = (favoritesReqSeqRef.current.get(normalizedFoodId) || 0) + 1;
    favoritesReqSeqRef.current.set(normalizedFoodId, nextSeq);

    try {
      if (alreadyFavorite) {
        await removeFavorite(user.dbUserId, normalizedFoodId);
      } else {
        await addFavorite(user.dbUserId, normalizedFoodId);
      }

      return true;
    } catch (error) {
      const latestSeq = favoritesReqSeqRef.current.get(normalizedFoodId);
      if (latestSeq === nextSeq) {
        setFavorites(previousFavorites);
      }
      console.error("Failed to sync favorite with server.", error);
      return false;
    } finally {
      const latestSeq = favoritesReqSeqRef.current.get(normalizedFoodId);
      if (latestSeq === nextSeq) {
        favoritesReqSeqRef.current.delete(normalizedFoodId);
      }
    }
  }, [user?.dbUserId]);

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
