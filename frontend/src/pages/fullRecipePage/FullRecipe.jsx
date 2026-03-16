import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Center,
  Flex,
  Icon,
  Button,
  Separator,
  IconButton,
} from "@chakra-ui/react";
import { FiCheck, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useUser } from "../../context/UserProvider";
import { useApp } from "../../context/AppProvider.jsx";
import { getRatingsByFood } from "../../services/api/rating.service";
import { getCommentsByFood } from "../../services/api/comment.service";
import MayLike from "./components/MayLike";
import CommentSection from "./components/CommentSection";
import colors from "../../theme/tokens";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

const FullRecipe = ({ foodId, onClose }) => {
  const { user } = useUser();
  const { selectedIds, favorites, toggleFavorite } = useApp();
  const [activeFoodId, setActiveFoodId] = useState(foodId);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setActiveFoodId(foodId);
  }, [foodId]);

  useEffect(() => {
    if (!activeFoodId) return;
    const isFav = (favorites || []).some(
      (id) => Number(id) === Number(activeFoodId),
    );
    setIsFavorite(isFav);
  }, [favorites, activeFoodId]);

  useEffect(() => {
    if (!activeFoodId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/foods/${activeFoodId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`fetch failed ${res.status}`);
        return res.json();
      })
      .then((data) => setFood(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeFoodId]);

  useEffect(() => {
    if (!activeFoodId) return;

    Promise.all([
      getRatingsByFood(activeFoodId).catch(() => []),
      getCommentsByFood(activeFoodId).catch(() => []),
    ])
      .then(([ratingData, commentData]) => {
        setRatings(ratingData || []);
        setComments(commentData || []);
      })
      .catch((e) => console.error("Error loading ratings/comments:", e));
  }, [activeFoodId]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    toggleFavorite(activeFoodId);
    setIsFavorite((prev) => !prev);
  };

  if (loading)
    return (
      <AppLoadingState
        title="Loading recipe"
        description="Fetching full recipe details."
        minH="100vh"
      />
    );

  if (error) return <Text color="red.500">{error}</Text>;
  if (!food) return null;

  const ingredientList = food.ingredients || [];
  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;
  const filledStars = Math.round(Number(avgRating) || 0);
  const matchedCount = ingredientList.filter((ing) =>
    selectedIds.includes(ing.ingredient_id),
  ).length;
  const matchLabel = ingredientList.length
    ? matchedCount === ingredientList.length
      ? "You have all the ingredients"
      : `You have matched ${matchedCount} ingredient${matchedCount === 1 ? "" : "s"}`
    : "No ingredients listed";

  const sourceDomain = (() => {
    try {
      return new URL(food.link_url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const sourceDomainLabel = sourceDomain || "cookfood.com";

  return (
    <Box
      position="fixed"
      right="0"
      top="0"
      height="100vh"
      width={{ base: "100%", lg: "38%" }}
      minWidth={{ base: "0", lg: "390px" }}
      maxWidth={{ base: "100%", lg: "520px" }}
      bg={colors.pageBg}
      overflowY="auto"
      boxShadow="lg"
      zIndex="10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hero Image with top controls */}
      <Box position="relative" height={{ base: "300px", md: "360px" }}>
        <Image
          src={food.image_url}
          alt={food.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />

        <IconButton
          aria-label="Close"
          position="absolute"
          top="3"
          left="3"
          bg="white"
          color={colors.darkest}
          borderRadius="full"
          _hover={{ bg: "gray.100" }}
          onClick={onClose}
          zIndex="11"
        >
          <AiOutlineClose size={22} />
        </IconButton>

        <IconButton
          aria-label="More"
          position="absolute"
          top="3"
          right="3"
          bg="white"
          color={colors.darkest}
          borderRadius="full"
          _hover={{ bg: "gray.100" }}
          zIndex="11"
        >
          <FiMoreHorizontal size={22} />
        </IconButton>

        {/* Floating summary card */}
        <Box
          position="absolute"
          left="6"
          right="6"
          bottom="-54px"
          bg="#F7F7F8"
          borderRadius="xl"
          boxShadow="0 8px 18px rgba(0,0,0,0.12)"
          overflow="hidden"
        >
          <Box px="4" py="3">
            <Flex justify="space-between" align="start" gap="2">
              <Box flex="1" minW="0">
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  color={colors.darkest}
                  lineHeight="1.3"
                  lineClamp={2}
                >
                  {food.title}
                </Text>
                <Text fontSize="sm" color="gray.500" mt="1">
                  {matchLabel}
                </Text>
              </Box>

              <IconButton
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                onClick={handleFavoriteClick}
                bg={isFavorite ? "red.500" : "white"}
                color={isFavorite ? "white" : "red.500"}
                border="1px solid"
                borderColor={isFavorite ? "red.500" : "red.300"}
                _hover={{
                  bg: isFavorite ? "red.600" : "red.500",
                  color: "white",
                }}
                borderRadius="full"
                size="sm"
                flexShrink={0}
              >
                <FiHeart size={18} />
              </IconButton>
            </Flex>
          </Box>

          <Separator />

          <Flex px="4" py="3" justify="space-between" align="center">
            <Flex align="center" gap="1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={FaStar}
                  boxSize="4"
                  color={star <= filledStars ? "#FDB022" : "gray.300"}
                />
              ))}
            </Flex>
            <Text fontSize="sm" color="gray.500">
              {avgRating} ({ratings.length})
            </Text>
          </Flex>
        </Box>
      </Box>

      {/* Content Section */}
      <Box p={{ base: "4", md: "5" }} pt={{ base: "14", md: "18" }}>
        {/* Ingredients */}
        <Box mb="5">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={colors.darkest}
            mb="4"
            mt="12"
          >
            Ingredients
          </Text>

          <Box bg="white" borderRadius="lg" p="4" boxShadow="sm">
            {ingredientList.length > 0 ? (
              <Flex direction="column" gap="3">
                {ingredientList.map((ingredient) => (
                  <Flex
                    key={ingredient.ingredient_id}
                    align="center"
                    justify="space-between"
                    gap="3"
                    pb="3"
                    _notLast={{
                      borderBottom: "1px solid",
                      borderColor: "gray.200",
                    }}
                  >
                    <Flex align="center" gap="3" minW="0" flex="1">
                      <Box
                        width="6px"
                        height="6px"
                        borderRadius="full"
                        bg={colors.primary}
                        flexShrink={0}
                      />
                      <Text color="gray.700" fontSize="sm" lineHeight="1.5">
                        {ingredient.name}
                      </Text>
                    </Flex>
                    <Center
                      boxSize="7"
                      borderRadius="full"
                      bg={
                        selectedIds.includes(ingredient.ingredient_id)
                          ? "blue.400"
                          : "gray.200"
                      }
                      color="white"
                      flexShrink={0}
                    >
                      <Icon as={FiCheck} boxSize="3.5" />
                    </Center>
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
        <Box mb="8">
          <Button
            as="a"
            href={food.link_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            isDisabled={!food.link_url}
            width="100%"
            bg={colors.primary}
            color="white"
            fontWeight="bold"
            py="4"
            _hover={{ bg: colors.dark }}
            borderRadius="lg"
            height="auto"
            minH="58px"
          >
            <Flex direction="column" align="center" lineHeight="1.15">
              <Text fontWeight="bold">View Full Recipe</Text>
              <Text
                fontSize="xs"
                color="whiteAlpha.900"
                fontWeight="400"
                mt="1"
              >
                ( {sourceDomainLabel} )
              </Text>
            </Flex>
          </Button>
        </Box>

        {/* You Might Also Like */}
        <Box mb="8">
          <MayLike
            currentFoodId={food.food_id}
            currentIngredients={ingredientList}
            onSelectFood={(nextFoodId) => setActiveFoodId(nextFoodId)}
          />
        </Box>

        {/* Reviews Section */}
        <Box>
          <CommentSection
            foodId={food.food_id}
            comments={comments}
            ratings={ratings}
            onReviewDataChange={({ comments: nextComments, ratings: nextRatings }) => {
              setComments(nextComments || []);
              setRatings(nextRatings || []);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FullRecipe;
