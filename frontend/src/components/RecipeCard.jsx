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

export default function RecipeCard({ food, isFavorite, onToggleFavorite, onView }) {
  return (
    <Flex
      onClick={() => onView(food)}   // 🔥 CONNECTED HERE
      cursor="pointer"
      direction={{ base: "column", md: "row" }}
      bg="#E3F2FD"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      p="5"
      gap="5"
      maxW="lg"
      w="full"
    >
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
        <Text fontWeight="bold" fontSize="xl" isTruncated>
          {food.title}
        </Text>

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

        <Text fontSize="sm" color="gray.500" noOfLines={3}>
          Ingredients: {food.ingredients?.slice(0, 40)}...
        </Text>

        <HStack justify="space-between" w="full" mt="4">
          <Button
            colorScheme="orange"
            size="sm"
            variant="solid"
            borderRadius="xl"
            width="full"
          >
            View Recipe
          </Button>

          <IconButton
            aria-label="Toggle favorite"
            icon={<FiHeart />}
            onClick={(e) => {
              e.stopPropagation();  // prevent opening FullRecipe
              onToggleFavorite(food.food_id);
            }}
            bg={isFavorite ? "red.500" : "whiteAlpha.900"}
            color={isFavorite ? "white" : "gray.800"}
            _hover={{ opacity: 0.9 }}
            borderRadius="full"
          />
        </HStack>
      </VStack>
    </Flex>
  );
}