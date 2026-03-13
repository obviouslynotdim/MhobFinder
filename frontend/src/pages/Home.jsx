import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useApp } from "../context/AppProvider.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import IngredientChip from "../components/IngredientChip.jsx";
import CategoryDropdown from "../components/CategoryDropdown.jsx";
import FullRecipe from "./fullRecipePage/FullRecipe.jsx";
import { colors } from "../theme/tokens.js";

import chefImage from "../assets/chef-serving.png";

const FALLBACK_CATEGORY_NAMES = [
  "Khmer Food",
  "European",
  "Seafood",
  "Dessert",
  "Street Food",
  "Curry",
  "Soup",
];

const FALLBACK_CATEGORY_KEYWORDS = {
  "Khmer Food": ["khmer", "cambodian"],
  European: [
    "italian",
    "french",
    "spanish",
    "german",
    "greek",
    "british",
    "hungarian",
    "austrian",
  ],
  Seafood: ["fish", "crab", "squid", "prawn", "shrimp", "seafood"],
  Dessert: ["dessert", "cake", "sweet", "pancake", "jelly", "rice balls"],
  "Street Food": [
    "street",
    "sandwich",
    "skewers",
    "grilled",
    "stir-fried",
    "fried",
  ],
  Curry: ["curry"],
  Soup: ["soup", "samlor", "tom yum", "broth", "minestrone"],
};

function HomeEmptyState() {
  return (
    <VStack h="full" justify="center" gap="4" textAlign="center" py="20">
      <Image src={chefImage} alt="Chef" boxSize="160px" opacity="0.9" />
      <Text fontWeight="normal" fontSize="xl">
        Add your ingredients to get started
      </Text>
      <Text fontWeight="normal" fontSize="xl">
        Every ingredient you add will unlock more recipes
      </Text>
    </VStack>
  );
}

function HomeNoResults({ onClear }) {
  return (
    <VStack h="full" justify="center" gap="3" textAlign="center" py="20">
      <Text fontWeight="bold" fontSize="xl">
        No recipes found
      </Text>
      <Text opacity="0.75">
        Try adding more ingredients, or clear your selection.
      </Text>
      <Button variant="outline" onClick={onClear}>
        Clear ingredients
      </Button>
    </VStack>
  );
}

function HomeLoading() {
  return (
    <VStack h="full" justify="center" gap="3" textAlign="center" py="20">
      <Text fontWeight="bold">Loading recipes…</Text>
      <Text opacity="0.75">Matching recipes to your ingredients.</Text>
    </VStack>
  );
}

export default function Home() {
  const {
    ingredients,
    selectedIds,
    foods,
    favorites,
    toggleFavorite,
    clearIngredients,
    toggleIngredient,
    foodsLoading,
  } = useApp();

  const selectedIngredients = ingredients.filter((i) =>
    selectedIds.includes(i.ingredient_id),
  );

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOptions, setCategoryOptions] = useState([
    { name: "All", foodIds: null },
    ...FALLBACK_CATEGORY_NAMES.map((name) => ({ name, foodIds: null })),
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "";
        const res = await fetch(`${API_BASE}/api/categories`, {
          credentials: "include",
        });
        if (!res.ok)
          throw new Error(`Failed to load categories: ${res.status}`);

        const data = await res.json();
        if (!mounted || !Array.isArray(data)) return;

        const normalized = data.map((cat) => ({
          name: cat.name,
          foodIds: new Set((cat.foods || []).map((food) => food.food_id)),
        }));

        setCategoryOptions([{ name: "All", foodIds: null }, ...normalized]);
      } catch {
        // Keep fallback options when categories API is unavailable.
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const location = window.location.pathname;
  const filteredFoods = useMemo(() => {
    // On admin route, always show all foods
    if (location.startsWith("/admin")) return foods;
    if (selectedCategory === "All") return foods;
    const selected = categoryOptions.find(
      (cat) => cat.name === selectedCategory,
    );
    if (!selected) return foods;
    if (!selected.foodIds || selected.foodIds.size === 0) {
      const keywords = FALLBACK_CATEGORY_KEYWORDS[selectedCategory] || [];
      if (keywords.length === 0) return foods;

      return foods.filter((food) => {
        const haystack =
          `${food.title || ""} ${food.description || ""}`.toLowerCase();
        return keywords.some((kw) => haystack.includes(kw));
      });
    }
    return foods.filter((food) => selected.foodIds.has(food.food_id));
  }, [foods, categoryOptions, selectedCategory]);

  if (selectedIds.length === 0) return <HomeEmptyState />;
  if (foodsLoading) return <HomeLoading />;
  if (foods.length === 0) return <HomeNoResults onClear={clearIngredients} />;

  return (
    <Box
      p={{ base: 4, md: 6 }}
      position="relative"
      maxW="1280px"
      mx="auto"
      w="full"
    >
      <HStack justify="space-between" mb="4" align="start">
        <VStack align="start" gap="0">
          <Text
            fontWeight="bold"
            fontSize={{ base: "lg", md: "2xl" }}
            color={colors.darkest}
          >
            You can make {filteredFoods.length} recipe
            {filteredFoods.length > 1 ? "s" : ""}
          </Text>
          <Text fontSize="sm" color={colors.dark} opacity="0.85">
            Do you have?
          </Text>

          {/* Selected ingredient chips */}
          {selectedIngredients.length > 0 && (
            <Wrap gap="1.5" mt="2">
              {selectedIngredients.map((i) => (
                <WrapItem key={i.ingredient_id}>
                  <IngredientChip
                    name={i.name}
                    onRemove={() => toggleIngredient(i.ingredient_id)}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </VStack>

        <CategoryDropdown
          options={categoryOptions}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
      </HStack>

      {filteredFoods.length === 0 && (
        <VStack h="full" justify="center" gap="3" textAlign="center" py="20">
          <Text fontWeight="bold" fontSize="xl">
            No recipes in {selectedCategory}
          </Text>
          <Text opacity="0.75">Try another category.</Text>
        </VStack>
      )}

      {/* 2 cards per row + spacing — switch to 2 col only at lg so md viewport has room */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="3">
        {filteredFoods.map((food) => (
          <RecipeCard
            key={food.food_id}
            food={food}
            isFavorite={favorites.includes(food.food_id)}
            onToggleFavorite={toggleFavorite}
            onView={() => setSelectedRecipe(food)}
          />
        ))}
      </SimpleGrid>

      {/* FullRecipe Modal + Dark Backdrop */}
      {selectedRecipe && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="blackAlpha.600"
            zIndex="9"
            onClick={() => setSelectedRecipe(null)}
          />

          <FullRecipe
            foodId={selectedRecipe.food_id}
            onClose={() => setSelectedRecipe(null)}
          />
        </>
      )}
    </Box>
  );
}
