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
  return (
    <Flex
      onClick={() => onView(food)}
      cursor="pointer"
      direction={{ base: "column", md: "row" }}
      bg="#E3F2FD"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      p="4"
      maxW="100%" // ensure it stays within grid cell
    >
      {/* Image */}
      <Box
        flex={{ base: "1 1 100%", md: "0 0 150px" }}
        h="150px"
        overflow="hidden"
        borderRadius="full"
      >
        <Image
          src={food.image_url}
          alt={food.title}
          w="100%"
          h="100%"
          objectFit="cover"
          borderRadius="full"
        />
      </Box>

      {/* Info */}
      <VStack align="start" spacing={3} flex="1" pt="2">
        <Text fontWeight="bold" fontSize="xl" isTruncated>
          {food.title}
        </Text>

        <HStack spacing={2}>
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

        <HStack justify="space-between" w="75%">
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
              e.stopPropagation();
              onToggleFavorite(food.food_id);
            }}
            bg={isFavorite ? "red.500" : "white"}
            color={isFavorite ? "white" : "red.500"} // heart visible
            _hover={{ opacity: 0.8 }}
            borderRadius="full"
          />
        </HStack>
      </VStack>
    </Flex>
  );
}