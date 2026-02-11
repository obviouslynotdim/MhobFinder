import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  Button,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

export default function RecipeCard({ food, isFavorite, onToggleFavorite }) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }} // Stack vertically on small screens, side by side on larger screens
      bg="#E3F2FD"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      p="5"
      gap="5" // Adds space between the image section and text section
      maxW="lg"
      w="full"
    >
      {/* Left side: Food Image and View Button */}
      <Box
        flex="0 0 200px"
        w="400px"
        h="200px"
        overflow="hidden"
        borderRadius="full"
      >
        <Image
          src={food.image_url}
          alt={food.title}
          w="full"
          h="full"
          objectFit="cover"
          borderRadius="full"
        />
      </Box>

      <VStack align="start" spacing={4} flex="1" pt="2">
        {/* Recipe Title */}
        <Text fontWeight="bold" fontSize="xl" isTruncated>
          {food.title}
        </Text>

        {/* Time, Difficulty, and Vegan Status Badges */}
        <HStack spacing={3}>
          <Badge colorScheme="blue" variant="subtle">
            {food.time} mins
          </Badge>
          <Badge colorScheme="green" variant="subtle">
            {food.isVegan ? "Vegan" : "Non-Vegan"}
          </Badge>
          <Badge colorScheme="orange" variant="subtle">
            {food.difficulty}
          </Badge>
        </HStack>

        {/* Ingredients List */}
        <Text fontSize="sm" color="gray.500" noOfLines={3}>
          Ingredients: {food.ingredients?.slice(0, 40)}...
        </Text>

        {/* Buttons and Favorite Icon */}
        <HStack justify="space-between" w="full" mt="4">
          <Button
            colorScheme="orange"
            size="sm"
            variant="solid"
            borderRadius="xl"
            width="full"
          >
            View
          </Button>

          <IconButton
            aria-label="Toggle favorite"
            icon={<FiHeart />}
            onClick={() => onToggleFavorite(food.food_id)}
            bg={isFavorite ? "red.500" : "whiteAlpha.900"}
            color={isFavorite ? "white" : "gray.800"}
            _hover={{ opacity: 0.9 }}
            borderRadius="full"
            top="3"
            right="3"
          />
        </HStack>
      </VStack>
    </Flex>
  );
}
