import {
  Flex,
  Box,
  Image,
  Text,
  Badge,
  Button,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

export default function RecipeCard({ food, isFavorite, onToggleFavorite, onView }) {
  const ingredientsPreview = (() => {
    const ing = food.ingredients;

    if (Array.isArray(ing)) {
      const shown = ing.slice(0, 6);
      return `${shown.join(", ")}${ing.length > shown.length ? "…" : ""}`;
    }

    if (typeof ing === "string") {
      const trimmed = ing.trim();
      const max = 80;
      return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
    }

    return "—";
  })();

  return (
    <Flex
      onClick={() => onView(food)}
      cursor="pointer"
      direction={{ base: "column", md: "row" }}
      bg="#E3F2FD"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      p={4}
      w="full"
      _hover={{ boxShadow: "lg" }}
    >
      {/* Image */}
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
          alt={food.title}
          w="full"
          h="full"
          objectFit="cover"
          borderRadius="full"
          fallbackSrc="https://via.placeholder.com/150"
        />
      </Box>

      {/* Info */}
      <VStack align="start" spacing={3} flex="1">
        <Text fontWeight="bold" fontSize="xl" noOfLines={1}>
          {food.title}
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
          Ingredients: {ingredientsPreview}
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