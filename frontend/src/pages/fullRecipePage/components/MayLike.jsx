import { useEffect, useState } from "react";
import { Box, Text, Button, Spinner, Center } from "@chakra-ui/react";
import MayLikeCard from "./MayLikeCard";
import { getAllFoods } from "../../../services/api/food.service";
import colors from "../../../theme/tokens";

const MayLike = ({ currentFoodId, currentIngredients = [] }) => {
  const [suggestedFoods, setSuggestedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!currentFoodId) return;

    setLoading(true);
    getAllFoods()
      .then((foods) => {
        // Filter out current food and find foods with shared ingredients
        const currentIngredientIds = new Set(
          currentIngredients.map((ing) => ing.ingredient_id)
        );

        const suggestedList = foods
          .filter((food) => food.food_id !== currentFoodId)
          .map((food) => {
            const sharedCount = (food.ingredients || []).filter((ing) =>
              currentIngredientIds.has(ing.ingredient_id)
            ).length;
            return { ...food, sharedCount };
          })
          .filter((food) => food.sharedCount > 0)
          .sort((a, b) => b.sharedCount - a.sharedCount)
          .slice(0, 6); // Get top 6 suggestions

        setSuggestedFoods(suggestedList);
      })
      .catch((error) => console.error("Error loading suggested foods:", error))
      .finally(() => setLoading(false));
  }, [currentFoodId, currentIngredients]);

  if (loading) return <Spinner size="sm" color={colors.primary} />;
  if (suggestedFoods.length === 0) return null;

  const displayedFoods = showMore ? suggestedFoods : suggestedFoods.slice(0, 3);

  return (
    <Box bg="white" borderRadius="lg" p="6" boxShadow="sm">
      <Text fontSize="lg" fontWeight="bold" color={colors.darkest} mb="4">
        You Might Also Like
      </Text>

      <Box display="flex" flexDirection="column" gap="3" mb="4">
        {displayedFoods.map((food) => (
          <MayLikeCard
            key={food.food_id}
            title={food.title}
            image={food.image_url}
            sharedIngredients={food.sharedCount}
            totalIngredients={food.ingredients?.length || 0}
          />
        ))}
      </Box>

      {suggestedFoods.length > 3 && (
        <Center>
          <Button
            variant="outline"
            borderColor={colors.primary}
            color={colors.primary}
            width="100%"
            onClick={() => setShowMore(!showMore)}
            _hover={{ bg: colors.chipHover }}
          >
            {showMore ? "Show Less" : `Show More (${suggestedFoods.length - 3} more)`}
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default MayLike;