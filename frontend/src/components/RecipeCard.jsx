import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";



export default function RecipeCard({ food, isFavorite, onToggleFavorite }) {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="md"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative">
        <Image
          src={food.image_url}
          w="full"
          h={{ base: "180px", md: "200px" }}
          objectFit="cover"
        />
        <IconButton
          aria-label="Toggle favorite"
          position="absolute"
          top="3"
          right="3"
          borderRadius="full"
          bg={isFavorite ? "red.500" : "whiteAlpha.900"}
          color={isFavorite ? "white" : "gray.800"}
          _hover={{ opacity: 0.9 }}
          onClick={() => onToggleFavorite(food.food_id)}
        >
          <FiHeart />
        </IconButton>
      </Box>

      <VStack align="start" p="5" gap="2" w="full" minW="0" flex="1">
        <Text fontWeight="bold" fontSize="lg" noOfLines={1} w="full">
          {food.title}
        </Text>

        <HStack gap={2} flexWrap="wrap">
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
          <Text fontSize="xs" color="gray.500" noOfLines={2}>
            Matched: {food.matched}
          </Text>
        )}

        <Button
          colorPalette="blue"
          size="sm"
          borderRadius="xl"
          mt="2"
          width="full"
          variant="outline"
        >
          View Full Recipe
        </Button>
      </VStack>
    </Box>
  );
}
