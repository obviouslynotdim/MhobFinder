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

function HomeEmptyState() {
  return (
    <VStack h="full" justify="center" gap="4" textAlign="center" py="20">
      <Image
        src="https://cdn-icons-png.flaticon.com/512/2276/2276931.png"
        alt="Chef"
        boxSize="96px"
        opacity="0.9"
      />
      <Text fontWeight="normal" fontSize="xl">
        Add your ingredients to get started
      </Text>
      <Text fontWeight="normal" fontSize="xl">
        Every Ingreadients you add will unlocks more recipes
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
    selectedIds,
    foods,
    favorites,
    toggleFavorite,
    clearIngredients,
    foodsLoading,
  } = useApp();

  if (selectedIds.length === 0) {
    return <HomeEmptyState />;
  }

  // Avoid the "blank" main panel when an ingredient has no matches
  // or while the match request is in-flight.
  if (foodsLoading) {
    return <HomeLoading />;
  }

  if (foods.length === 0) {
    return <HomeNoResults onClear={clearIngredients} />;
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <HStack justify="space-between" mb="4" align="start">
        <VStack align="start" gap="0">
          <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }}>
            You can make {foods.length} recipe{foods.length > 1 ? "s" : ""}
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
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
