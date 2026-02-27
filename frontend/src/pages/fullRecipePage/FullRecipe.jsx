import { useEffect, useState } from "react";
import { Box, Image, Text, Spinner, Center } from "@chakra-ui/react";
import OverlayBox from "./components/OverlayBox";
import ViewFullRecipe from "./components/ViewFullRecipe";
import MayLike from "./components/MayLike";
import CommentSection from "./components/CommentSection";

const FullRecipe = ({ foodId, onClose }) => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!foodId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/foods/${foodId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`fetch failed ${res.status}`);
        return res.json();
      })
      .then((data) => setFood(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [foodId]);

  if (loading)
    return (
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    );

  if (error) return <Text color="red.500">{error}</Text>;
  if (!food) return null;

  // ingredients come as array of objects thanks to the include clause
  const ingredientList = food.ingredients || [];

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
