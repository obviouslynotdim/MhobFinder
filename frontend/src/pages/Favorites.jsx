import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";

function FavoriteCard({ food, isFavorite, onToggleFavorite }) {
  return (
    <Box bg="white" borderRadius="2xl" boxShadow="md" p="4" overflow="hidden">
      <HStack align="stretch" gap="4">
        <Image
          src={food.image_url}
          alt={food.title}
          boxSize="92px"
          objectFit="cover"
          borderRadius="xl"
          flexShrink={0}
        />

        <VStack align="start" gap="2" flex="1" minW="0">
          <Text fontWeight="bold" noOfLines={1} w="full">
            {food.title}
          </Text>

          <HStack gap="2" flexWrap="wrap">
            {food.time && (
              <Badge colorPalette="blue" variant="subtle">
                {food.time}
              </Badge>
            )}
            {food.category && (
              <Badge colorPalette="purple" variant="subtle">
                {food.category}
              </Badge>
            )}
            {food.difficulty && (
              <Badge colorPalette="orange" variant="subtle">
                {food.difficulty}
              </Badge>
            )}
          </HStack>

          {food.matched && (
            <Text fontSize="xs" color="gray.500" noOfLines={2} w="full">
              Matched: {food.matched}
            </Text>
          )}
        </VStack>

        <VStack justify="space-between" align="end">
          <IconButton
            aria-label="Remove from favorites"
            borderRadius="full"
            bg={isFavorite ? "red.500" : "gray.100"}
            color={isFavorite ? "white" : "gray.700"}
            _hover={{ opacity: 0.9 }}
            onClick={() => onToggleFavorite(food.food_id)}
          >
            <FiHeart />
          </IconButton>

          <Button size="sm" variant="outline" borderRadius="xl">
            View
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
}

export default function Favorites() {
  const nav = useNavigate();
  const { favorites, rawFoods, toggleFavorite } = useApp();

  const favoriteFoods = rawFoods.filter((f) => favorites.includes(f.food_id));

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* Header row like the video */}
      <HStack gap="3" mb="5" align="center">
        <IconButton
          aria-label="Back"
          onClick={() => nav(-1)}
          borderRadius="full"
          bg="white"
          boxShadow="md"
          _hover={{ opacity: 0.9 }}
        >
          <FiArrowLeft />
        </IconButton>

        <VStack align="start" gap="0" flex="1">
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Favorites
          </Text>
          <Text fontSize="sm" opacity="0.75">
            {favoriteFoods.length} recipe{favoriteFoods.length === 1 ? "" : "s"}
          </Text>
        </VStack>
      </HStack>

      {favoriteFoods.length === 0 ? (
        <Center py="16">
          <VStack
            bg="white"
            p="10"
            borderRadius="3xl"
            boxShadow="xl"
            textAlign="center"
            gap="3"
          >
            <Text fontSize="lg" fontWeight="bold">
              No favorites yet
            </Text>
            <Text fontSize="sm" opacity="0.75" maxW="420px">
              Tap the heart on a recipe card to save it here.
            </Text>
            <Button colorPalette="blue" onClick={() => nav("/")}>
              Browse recipes
            </Button>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
          {favoriteFoods.map((food) => (
            <FavoriteCard
              key={food.food_id}
              food={food}
              isFavorite={favorites.includes(food.food_id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
