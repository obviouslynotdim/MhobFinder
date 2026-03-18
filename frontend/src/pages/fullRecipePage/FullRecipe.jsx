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
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { FiCheck, FiFlag, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useUser } from "../../context/UserProvider";
import { useApp } from "../../context/AppProvider.jsx";
import { useUserAlert } from "../../context/UserAlertContext.jsx";
import { getRatingsByFood } from "../../services/api/rating.service";
import { getCommentsByFood } from "../../services/api/comment.service";
import { createBugReport } from "../../services/api/bugReport.service.js";
import MayLike from "./components/MayLike";
import CommentSection from "./components/CommentSection";
import colors from "../../theme/tokens";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

const REPORT_REASON_OPTIONS = [
  { code: "incorrect_ingredients", label: "Incorrect Ingredients" },
  { code: "recipe_missing", label: "The recipe no longer exists" },
  { code: "wrong_image", label: "Wrong Image" },
  { code: "incorrect_cuisine", label: "Incorrect cuisine" },
  { code: "wrong_meal_type", label: "Wrong meal type" },
  { code: "video_not_working", label: "Video doesn't work" },
  { code: "other", label: "Other" },
];

const reasonLabelMap = REPORT_REASON_OPTIONS.reduce((acc, option) => {
  acc[option.code] = option.label;
  return acc;
}, {});

const FullRecipe = ({ foodId, onClose }) => {
  const { user } = useUser();
  const { selectedIds, favorites, toggleFavorite } = useApp();
  const { showAlert } = useUserAlert();
  const [activeFoodId, setActiveFoodId] = useState(foodId);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportError, setReportError] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

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
      showAlert({
        tone: "info",
        title: "Sign in required",
        description: "Please login to save favorites",
      });
      return;
    }

    toggleFavorite(activeFoodId);
    setIsFavorite((prev) => !prev);
  };

  const handleOpenReportDialog = () => {
    if (!user) {
      showAlert({
        tone: "info",
        title: "Sign in required",
        description: "Please login to report a bug",
      });
      setMenuOpen(false);
      return;
    }
    setReportReason("");
    setReportDetails("");
    setReportError("");
    setReportOpen(true);
    setMenuOpen(false);
  };

  const handleSubmitReport = async () => {
    const reasonCode = String(reportReason || "").trim();
    const details = String(reportDetails || "").trim();
    if (!reasonCode) {
      setReportError("Please select what is wrong with the recipe.");
      return;
    }

    setSubmittingReport(true);
    setReportError("");
    try {
      await createBugReport({
        food_id: food.food_id,
        reason_code: reasonCode,
        details,
        // Backward compatibility for servers still expecting "description".
        description: details || reasonLabelMap[reasonCode] || "Bug report",
      });

      setReportOpen(false);
      setReportReason("");
      setReportDetails("");
      showAlert({
        tone: "success",
        title: "Report submitted",
        description: "Thanks for helping us improve. We'll review this shortly.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Unable to submit bug report right now.";
      setReportError(message);
    } finally {
      setSubmittingReport(false);
    }
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

        <Box position="absolute" top="3" right="3" zIndex="11">
          <IconButton
            aria-label="More"
            bg="white"
            color={colors.darkest}
            borderRadius="full"
            _hover={{ bg: "gray.100" }}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FiMoreHorizontal size={22} />
          </IconButton>

          {menuOpen && (
            <Box
              position="absolute"
              right="0"
              mt="2"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              minW="160px"
              py="1"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box
                px="4"
                py="2"
                fontSize="sm"
                color={colors.darkest}
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
                onClick={handleOpenReportDialog}
              >
                <HStack gap="2">
                  <FiFlag size={14} />
                  <Text fontSize="sm">Report bug</Text>
                </HStack>
              </Box>
            </Box>
          )}
        </Box>

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

      {reportOpen && (
        <>
          <Box
            position="fixed"
            inset="0"
            bg="blackAlpha.500"
            zIndex="1200"
            onClick={() => {
              if (submittingReport) return;
              setReportOpen(false);
            }}
          />

          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            w={{ base: "92vw", md: "520px" }}
            borderRadius="xl"
            p="5"
            boxShadow="0 16px 40px rgba(15,23,42,0.28)"
            zIndex="1300"
          >
            <Flex align="center" justify="space-between" gap="2">
              <Text fontSize="lg" fontWeight="700" color={colors.darkest}>
                Report a problem
              </Text>
              <IconButton
                aria-label="Close report dialog"
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (submittingReport) return;
                  setReportOpen(false);
                }}
              >
                <AiOutlineClose size={16} />
              </IconButton>
            </Flex>
            <Text mt="1" fontSize="sm" color="gray.600">
              What's wrong with the recipe?
            </Text>
            <Text mt="1" fontSize="xs" color="gray.500">
              You can send up to 3 reports per day.
            </Text>

            <Box mt="4" border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              {REPORT_REASON_OPTIONS.map((option) => {
                const selected = option.code === reportReason;
                return (
                  <Flex
                    key={option.code}
                    align="center"
                    gap="3"
                    px="3"
                    py="2.5"
                    cursor="pointer"
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    bg={selected ? "blue.50" : "white"}
                    onClick={() => {
                      setReportReason(option.code);
                      setReportError("");
                    }}
                    _last={{ borderBottom: "none" }}
                  >
                    <Box
                      boxSize="4"
                      borderRadius="sm"
                      border="2px solid"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderColor={selected ? colors.primary : "gray.300"}
                      bg={selected ? colors.primary : "white"}
                      color="white"
                    >
                      {selected ? <FiCheck size={12} /> : null}
                    </Box>
                    <Text fontSize="sm" color={colors.darkest}>
                      {option.label}
                    </Text>
                  </Flex>
                );
              })}
            </Box>

            <Textarea
              mt="3"
              minH="88px"
              resize="vertical"
              placeholder="Optional details"
              value={reportDetails}
              onChange={(event) => setReportDetails(event.target.value)}
              borderColor="gray.200"
            />

            {reportError ? (
              <Text mt="2" fontSize="sm" color="red.500">
                {reportError}
              </Text>
            ) : null}

            <Flex justify="flex-end" gap="2" mt="5">
              <Button
                variant="outline"
                onClick={() => setReportOpen(false)}
                isDisabled={submittingReport}
              >
                Cancel
              </Button>
              <Button
                bg={colors.primary}
                color="white"
                _hover={{ bg: colors.dark }}
                onClick={handleSubmitReport}
                loading={submittingReport}
                loadingText="Submitting"
              >
                Submit Report
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FullRecipe;
