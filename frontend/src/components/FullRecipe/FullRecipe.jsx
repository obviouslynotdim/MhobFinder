import { Box, Image, Text } from "@chakra-ui/react";
import OverlayBox from "./ui/OverlayBox";
import ViewFullRecipe from "./ui/ViewFullRecipe";
import MayLike from "./ui/MayLike";
import CommentSection from "./ui/CommentSection";

import { dummyFoods } from "../../mock/mockFoods";
import { dummyIngredients } from "../../mock/mockIngredients";

const FullRecipe = ({ foodId, onClose }) => {
  const food = dummyFoods.find((f) => f.food_id === foodId);

  if (!food) return null;

  const ingredientList = food.ingredients
    .map((id) =>
      dummyIngredients.find((ing) => ing.ingredient_id === id)
    )
    .filter(Boolean);

  return (
    <Box
      position="fixed"
      right="0"
      top="0"
      height="100vh"
      width="40%"
      minWidth="350px"
      bg="#A7BBDD"
      overflowY="auto"
      boxShadow="lg"
      zIndex="10"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      {/* Image + Overlay */}
      <Box position="relative">
        <Image
          src={food.image_url}
          alt={food.title}
          width="100%"
          height="250px"
          objectFit="cover"
        />

        <Box
          position="absolute"
          bottom="-60px"
          left="0"
          right="0"
          mx="auto"
          width="90%"
        >
          <OverlayBox
            title={food.title}
            hasAllIngredients={true}
            rating={4.5}
            time={food.time}
            isFavorite={false}
          />
        </Box>
      </Box>

      {/* Ingredients */}
      <Box p="4" pt="70px">
        <Text fontSize="xl" fontWeight="bold" mb="3">
          Ingredients
        </Text>

        <Box as="ul" pl="4">
          {ingredientList.map((ingredient) => (
            <Box as="li" key={ingredient.ingredient_id} mb="2">
              <Text>• {ingredient.name}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <ViewFullRecipe />
      </Box>

      <Box mt="5">
        <MayLike currentFoodId={food.food_id} />
      </Box>

      <Box>
        <CommentSection />
      </Box>
    </Box>
  );
};

export default FullRecipe;