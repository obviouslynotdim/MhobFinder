import {
  Flex, Box, Image, Text, Badge, Button, IconButton, VStack, HStack,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { useApp } from "../app/state/AppProvider.jsx";


export default function RecipeCard({ food, isFavorite, onToggleFavorite, onView }) {
  const { selectedIds } = useApp();
  // build a lookup: { "1": "Salt", "2": "Garlic", ... }
  // const ingredientNameById = Object.fromEntries(
  //   (dummyIngredients ?? []).map((i) => [String(i.id), i.name])
  // );

  // const ingredientsPreview = (() => {
  //   const ing = food?.ingredients;

  //   if (Array.isArray(ing)) {
  //     const normalized = ing
  //       .map((x) => {
  //         // ingredient object
  //         if (x && typeof x === "object") {
  //           return x.name ?? x.title ?? x.label ?? x.id;
  //         }
  //         // ingredient id (number/string) -> name
  //         const key = String(x);
  //         return ingredientNameById[key] ?? x;
  //       })
  //       .filter(Boolean);

  //     const shown = normalized.slice(0, 6);
  //     return `${shown.join(", ")}${normalized.length > shown.length ? "…" : ""}`;
  //   }

  //   if (typeof ing === "string") {
  //     const trimmed = ing.trim();
  //     const max = 80;
  //     return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
  //   }

  //   return "—";
  // })();

  const title =
    food?.title ?? food?.name ?? food?.food_name ?? food?.foodName ?? `Food #${food?.food_id ?? food?.id ?? "—"}`;

  return (
    <Flex
      onClick={() => onView(food)}
      cursor="pointer"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 6 }} 
      bg="#E3F2FD"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      p={4}
      w="full"
      _hover={{ boxShadow: "lg" }}
    >
      <Box
        flexShrink={0}
        w="150px"
        h="150px"
        overflow="hidden"
        borderRadius="full"
        alignSelf={{ base: "center", md: "flex-start" }}
        mr={{ base: 0, md: 4 }}
        mb={{ base: 3, md: 0 }}
      >
        <Image
          src={food.image_url}
          alt={title}
          w="full"
          h="full"
          objectFit="cover"
          borderRadius="full"
          fallbackSrc="https://via.placeholder.com/150"
        />
      </Box>

      <VStack align="start" spacing={10} flex="1">
        <Text fontWeight="bold" fontSize="xl" noOfLines={1}>
          {title}
        </Text>

        <HStack spacing={2} flexWrap="wrap">
          <Badge colorScheme="blue" variant="subtle">
            {food.time} mins
          </Badge>
          <Badge colorScheme={food.isVegan ? "green" : "gray"} variant="subtle">
            {food.isVegan ? "Vegan" : "Non-Vegan"}
          </Badge>
          <Badge colorScheme="orange" variant="subtle">
            {food.difficulty}
          </Badge>
        </HStack>

        <Text fontSize="sm" color="gray.600" noOfLines={3}>
          You have all {selectedIds.length} ingredients.
        </Text>

        <HStack justify="space-between" w="full" pt={1}>
          <Button
            colorScheme="orange"
            size="sm"
            borderRadius="xl"
            onClick={(e) => {
              e.stopPropagation();
              onView(food);
            }}
          >
            View Recipe
          </Button>

          <IconButton
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            icon={<FiHeart />}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(food.food_id);
            }}
            bg={isFavorite ? "red.500" : "white"}
            color={isFavorite ? "white" : "red.500"}
            _hover={{ opacity: 0.85 }}
            borderRadius="full"
          />
        </HStack>
      </VStack>
    </Flex>
  );
}