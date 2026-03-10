import { useEffect, useState } from "react";
import { Box, Image, Text, Spinner, Center, Flex, Icon, Button, Separator, IconButton } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { FaStar, FaClock } from "react-icons/fa";
import { useUser } from "../../context/UserProvider";
import { addFavorite, removeFavorite } from "../../services/api/favorite.service";
import { getRatingsByFood } from "../../services/api/rating.service";
import { getCommentsByFood } from "../../services/api/comment.service";
import MayLike from "./components/MayLike";
import CommentSection from "./components/CommentSection";
import colors from "../../theme/tokens";

const FullRecipe = ({ foodId, onClose }) => {
  const { user } = useUser();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);

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

  useEffect(() => {
    if (!foodId) return;
    
    Promise.all([
      getRatingsByFood(foodId).catch(() => []),
      getCommentsByFood(foodId).catch(() => [])
    ])
    .then(([ratingData, commentData]) => {
      setRatings(ratingData || []);
      setComments(commentData || []);
    })
    .catch((e) => console.error("Error loading ratings/comments:", e));
  }, [foodId]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to save favorites");
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(user.id, foodId);
        setIsFavorite(false);
      } else {
        await addFavorite(user.id, foodId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading)
    return (
      <Center h="full">
        <Spinner size="xl" color={colors.primary} />
      </Center>
    );

  if (error) return <Text color="red.500">{error}</Text>;
  if (!food) return null;

  const ingredientList = food.ingredients || [];
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <Box
      position="fixed"
      right="0"
      top="0"
      height="100vh"
      width="40%"
      minWidth="350px"
      bg={colors.pageBg}
      overflowY="auto"
      boxShadow="lg"
      zIndex="10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hero Image with Close Button */}
      <Box position="relative" height="280px">
        <Image
          src={food.image_url}
          alt={food.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />
        
        {/* Close Button */}
        <IconButton
          aria-label="Close"
          icon={<AiOutlineClose size={24} />}
          position="absolute"
          top="3"
          right="3"
          bg="white"
          color={colors.darkest}
          borderRadius="full"
          _hover={{ bg: "gray.100" }}
          onClick={onClose}
          zIndex="11"
        />
      </Box>

      {/* Content Section */}
      <Box p="6">
        {/* Header with Title & Favorite */}
        <Flex justify="space-between" align="flex-start" mb="4">
          <Box flex="1">
            <Text fontSize="2xl" fontWeight="bold" color={colors.darkest}>
              {food.title}
            </Text>
          </Box>
          
          <IconButton
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            icon={<FiHeart size={20} />}
            onClick={handleFavoriteClick}
            bg={isFavorite ? "red.500" : "white"}
            color={isFavorite ? "white" : "red.500"}
            border="1px solid"
            borderColor={isFavorite ? "red.500" : "red.300"}
            _hover={{
              bg: isFavorite ? "red.600" : "red.200",
              color: isFavorite ? "white" : "red.600",
            }}
            borderRadius="md"
            ml="3"
          />
        </Flex>

        {/* Quick Info Pills */}
        <Flex gap="3" mb="6" wrap="wrap">
          <Flex align="center" gap="2" bg="white" px="3" py="2" borderRadius="lg" boxShadow="sm">
            <Icon as={FaClock} color={colors.primary} boxSize="4" />
            <Text fontSize="sm" fontWeight="medium" color={colors.dark}>
              {food.time || "N/A"}
            </Text>
          </Flex>

          <Flex align="center" gap="2" bg="white" px="3" py="2" borderRadius="lg" boxShadow="sm">
            <Icon as={FaStar} color="#FDB022" boxSize="4" />
            <Text fontSize="sm" fontWeight="medium" color={colors.dark}>
              {avgRating} ({ratings.length})
            </Text>
          </Flex>
        </Flex>

        <Separator my="6" />

        {/* Ingredients */}
        <Box mb="8">
          <Text fontSize="lg" fontWeight="bold" color={colors.darkest} mb="4">
            Ingredients
          </Text>

          <Box bg="white" borderRadius="lg" p="4" boxShadow="sm">
            {ingredientList.length > 0 ? (
              <Flex direction="column" gap="3">
                {ingredientList.map((ingredient) => (
                  <Flex
                    key={ingredient.ingredient_id}
                    align="center"
                    gap="3"
                    pb="2"
                    _notLast={{ borderBottom: "1px solid", borderColor: "gray.200" }}
                  >
                    <Box
                      width="6px"
                      height="6px"
                      borderRadius="full"
                      bg={colors.primary}
                      flexShrink={0}
                    />
                    <Text color="gray.700" fontSize="sm">
                      {ingredient.name}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No ingredients listed
              </Text>
            )}
          </Box>
        </Box>

        {/* View Recipe Button */}
        <Button
          width="100%"
          bg={colors.primary}
          color="white"
          fontWeight="bold"
          py="6"
          mb="8"
          _hover={{ bg: colors.dark }}
          borderRadius="lg"
        >
          View Full Recipe
        </Button>

        {/* You Might Also Like */}
        <Box mb="8">
          <MayLike currentFoodId={food.food_id} currentIngredients={ingredientList} />
        </Box>

        {/* Reviews Section */}
        <Box>
          <CommentSection foodId={food.food_id} comments={comments} ratings={ratings} />
        </Box>
      </Box>
    </Box>
  );
};

export default FullRecipe;
