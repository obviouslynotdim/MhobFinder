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
import { FiChevronDown } from "react-icons/fi";
import { useApp } from "../../context/AppProvider.jsx";
import { useTranslation } from "../../context/useTranslation.js";
import RecipeCard from "../../components/RecipeCard.jsx";
import IngredientChip from "../../components/IngredientChip.jsx";
import CategoryDropdown from "../../components/CategoryDropdown.jsx";
import FullRecipe from "../fullRecipePage/FullRecipe.jsx";
import { colors } from "../../theme/tokens.js";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

import chefImage from "../../assets/chef-serving.png";

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

const CATEGORY_TRANSLATION_KEYS = {
  All: "all",
  "Khmer Food": "khmerFood",
  European: "european",
  Seafood: "seafood",
  Dessert: "dessert",
  "Street Food": "streetFood",
  Curry: "curry",
  Soup: "soup",
};

const HOME_PAGE_BATCH_SIZE = 30;

function HomeEmptyState({ t }) {
  return (
    <VStack h="full" justify="center" gap={{ base: "3", md: "4" }} textAlign="center" py={{ base: "14", md: "20" }}>
      <Image src={chefImage} alt="Chef" boxSize={{ base: "120px", md: "160px" }} opacity="0.9" />
      <Text fontWeight="normal" fontSize={{ base: "lg", md: "xl" }}>
        {t("home.emptyTitle")}
      </Text>
      <Text fontWeight="normal" fontSize={{ base: "lg", md: "xl" }}>
        {t("home.emptySubtitle")}
      </Text>
    </VStack>
  );
}

function HomeNoResults({ onClear, t }) {
  return (
    <Box py={{ base: "14", md: "20" }} px={{ base: 1, md: 4 }}>
      <VStack
        maxW="620px"
        mx="auto"
        gap={{ base: "3", md: "4" }}
        textAlign="center"
        bg="white"
        border="1px solid"
        borderColor={`${colors.primary}33`}
        borderRadius="2xl"
        boxShadow="sm"
        p={{ base: 4, md: 7 }}
      >
        <Image src={chefImage} alt="Chef" boxSize={{ base: "120px", md: "160px" }} opacity="0.9" />
        <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color={colors.darkest}>
          {t("home.noRecipesFound")}
        </Text>
        <Text opacity="0.8" maxW="460px" color={colors.dark} fontSize={{ base: "sm", md: "md" }}>
          {t("home.noRecipesHint")}
        </Text>
        <Button
          onClick={onClear}
          bg={colors.primary}
          color="white"
          _hover={{ bg: colors.dark }}
        >
          {t("home.clearIngredients")}
        </Button>
      </VStack>
    </Box>
  );
}

function HomeLoading({ t }) {
  return (
    <AppLoadingState
      title={t("home.loadingRecipes")}
      description={t("home.loadingHint")}
      minH="320px"
    />
  );
}

export default function Home() {
  const { t } = useTranslation();
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
  const [visibleCount, setVisibleCount] = useState(HOME_PAGE_BATCH_SIZE);
  const [categoryOptions, setCategoryOptions] = useState([
    { name: "All", foodIds: null },
    ...FALLBACK_CATEGORY_NAMES.map((name) => ({ name, foodIds: null })),
  ]);

  const getCategoryLabel = useMemo(
    () =>
      (name) => {
        const key = CATEGORY_TRANSLATION_KEYS[name];
        if (!key) return name;
        return t(`home.categories.${key}`);
      },
    [t],
  );

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
  }, [foods, categoryOptions, selectedCategory, location]);

  useEffect(() => {
    setVisibleCount(HOME_PAGE_BATCH_SIZE);
  }, [filteredFoods]);

  const visibleFoods = useMemo(
    () => filteredFoods.slice(0, visibleCount),
    [filteredFoods, visibleCount],
  );

  const hasMoreFoods = visibleCount < filteredFoods.length;

  if (selectedIds.length === 0) return <HomeEmptyState t={t} />;
  if (foodsLoading) return <HomeLoading t={t} />;
  if (foods.length === 0) return <HomeNoResults onClear={clearIngredients} t={t} />;

  return (
    <Box
      px={{ base: 3, md: 6 }}
      pt={{ base: 3, md: 6 }}
      pb={{ base: "calc(88px + env(safe-area-inset-bottom))", md: 6 }}
      position="relative"
      maxW="1280px"
      mx="auto"
      w="full"
    >
      <HStack
        justify="space-between"
        mb={{ base: "3", md: "4" }}
        align={{ base: "stretch", md: "start" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: "2.5", md: "0" }}
      >
        <VStack align="start" gap="0">
          <Text
            fontWeight="bold"
            fontSize={{ base: "md", md: "2xl" }}
            color={colors.darkest}
          >
            {t("home.recipesYouCanMake", {
              count: filteredFoods.length,
              suffix: filteredFoods.length > 1 ? "s" : "",
            })}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color={colors.dark} opacity="0.85">
            {t("home.doYouHave")}
          </Text>

          {/* Selected ingredient chips */}
          {selectedIngredients.length > 0 && (
            <Wrap gap={{ base: "1", md: "1.5" }} mt="2">
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
          label={t("common.categoryLabel")}
          renderOptionLabel={getCategoryLabel}
        />
      </HStack>

      {filteredFoods.length === 0 && (
        <Box py={{ base: "14", md: "20" }} px={{ base: 1, md: 4 }}>
          <VStack
            maxW="640px"
            mx="auto"
            gap={{ base: "3", md: "4" }}
            textAlign="center"
            bg="white"
            border="1px solid"
            borderColor={`${colors.primary}33`}
            borderRadius="2xl"
            boxShadow="sm"
            p={{ base: 4, md: 7 }}
          >
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color={colors.darkest}>
              {t("home.noRecipesInCategory", {
                category: getCategoryLabel(selectedCategory),
              })}
            </Text>
            <Text opacity="0.8" color={colors.dark} fontSize={{ base: "sm", md: "md" }}>
              {t("home.tryAnotherCategory")}
            </Text>
            <HStack gap="2" wrap="wrap" justify="center">
              <Button
                variant="outline"
                borderColor={colors.primary}
                color={colors.dark}
                _hover={{ bg: colors.chipHover }}
                onClick={() => setSelectedCategory("All")}
              >
                {t("common.all")}
              </Button>
              <Button
                variant="outline"
                borderColor={colors.primary}
                color={colors.dark}
                _hover={{ bg: colors.chipHover }}
                onClick={clearIngredients}
              >
                {t("home.clearIngredients")}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* 2 cards per row + spacing — switch to 2 col only at lg so md viewport has room */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: "2.5", md: "3" }}>
        {visibleFoods.map((food) => (
          <RecipeCard
            key={food.food_id}
            food={food}
            isFavorite={favorites.includes(food.food_id)}
            onToggleFavorite={toggleFavorite}
            onView={() => setSelectedRecipe(food)}
          />
        ))}
      </SimpleGrid>

      {hasMoreFoods && (
        <HStack justify="center" mt={{ base: "5", md: "6" }}>
          <Button
            onClick={() => {
              setVisibleCount((prev) =>
                Math.min(prev + HOME_PAGE_BATCH_SIZE, filteredFoods.length),
              );
            }}
            variant="outline"
            borderColor={colors.primary}
            color={colors.dark}
            _hover={{ bg: colors.chipHover }}
            size={{ base: "sm", md: "md" }}
          >
            See more
            <FiChevronDown style={{ marginLeft: "6px" }} />
          </Button>
        </HStack>
      )}

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
