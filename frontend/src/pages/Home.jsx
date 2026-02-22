import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useApp } from "../app/state/AppProvider.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import FullRecipe from "../components/FullRecipe/FullRecipe.jsx";

export default function Home() {
  const {
    selectedIds,
    foods,
    favorites,
    toggleFavorite,
    clearIngredients,
    foodsLoading,
  } = useApp();

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (selectedIds.length === 0) return null;
  if (foodsLoading) return null;
  if (foods.length === 0) return null;

  return (
    <Box p={{ base: 4, md: 6 }} position="relative">
      <HStack justify="space-between" mb="4" align="start">
        <VStack align="start" gap="0">
          <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }}>
            You can make {foods.length} recipe
            {foods.length > 1 ? "s" : ""}
          </Text>
          <Text fontSize="sm" opacity="0.75">
            Do you have?
          </Text>
        </VStack>

        <Button variant="ghost" onClick={clearIngredients}>
          Clear
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
        {foods.map((food) => (
          <RecipeCard
            key={food.food_id}
            food={food}
            isFavorite={favorites.includes(food.food_id)}
            onToggleFavorite={toggleFavorite}
            onView={(food) => setSelectedRecipe(food)}
          />
        ))}
      </SimpleGrid>

      {/* Modal + Backdrop */}
      {selectedRecipe && (
        <>
          {/* Dark Background */}
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

          {/* Slide Panel */}
          <FullRecipe
            foodId={selectedRecipe.food_id}
            onClose={() => setSelectedRecipe(null)}
          />
        </>
      )}
    </Box>
  );
}