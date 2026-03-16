import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckSquare, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import AdminFoodCard from "../../components/AdminFoodCard.jsx";
import { getAllFoods, deleteFood } from "../../services/api/food.service.js";
import { colors } from "../../theme/tokens.js";

const ADMIN_PAGE_BATCH_SIZE = 30;

export default function AdminFoodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFoodIds, setSelectedFoodIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ADMIN_PAGE_BATCH_SIZE);

  // Load foods from backend
  useEffect(() => {
    async function fetchFoods() {
      setLoading(true);
      try {
        const data = await getAllFoods();
        setFoods(data);
      } catch (e) {
        console.error("Failed to load foods", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  // Handle update after edit
  useEffect(() => {
    const updatedFood = location.state?.updatedFood;
    if (!updatedFood) return;
    setFoods((prev) =>
      prev.map((food) =>
        food.food_id === updatedFood.food_id ? updatedFood : food,
      ),
    );
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const handleEdit = (food) => {
    if (selectionMode) {
      handleToggleSelect(food.food_id);
      return;
    }
    navigate(`/admin/edit-food/${food.food_id}`, {
      state: { food },
    });
  };

  const handleDelete = async (foodId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?",
    );
    if (!confirmed) return;
    try {
      await deleteFood(foodId);
      setFoods((prev) => prev.filter((food) => food.food_id !== foodId));
      setSelectedFoodIds((prev) => prev.filter((id) => id !== foodId));
    } catch {
      alert("Failed to delete food.");
    }
  };

  const handleToggleSelect = (foodId) => {
    setSelectedFoodIds((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId],
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedFoodIds.length === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedFoodIds.length} selected food(s)?`,
    );
    if (!confirmed) return;
    try {
      await Promise.all(selectedFoodIds.map(deleteFood));
      setFoods((prev) =>
        prev.filter((food) => !selectedFoodIds.includes(food.food_id)),
      );
      setSelectedFoodIds([]);
      setSelectionMode(false);
    } catch {
      alert("Failed to delete selected foods.");
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedFoodIds([]);
  };

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return foods;

    return foods.filter((food) => {
      const title = String(food.title || "").toLowerCase();
      const description = String(food.description || "").toLowerCase();
      const categories = Array.isArray(food.categories)
        ? food.categories.map((category) => String(category.name || "").toLowerCase())
        : [];

      return (
        title.includes(query) ||
        description.includes(query) ||
        categories.some((name) => name.includes(query))
      );
    });
  }, [foods, search]);

  useEffect(() => {
    setVisibleCount(ADMIN_PAGE_BATCH_SIZE);
  }, [search, foods.length]);

  const visibleFoods = useMemo(
    () => filteredFoods.slice(0, visibleCount),
    [filteredFoods, visibleCount],
  );

  const hasMoreFoods = visibleCount < filteredFoods.length;

  const linkedFoodsCount = foods.filter((food) => Boolean(food.link_url)).length;

  return (
    <Box h="100%" minH={0} overflow="auto" overflowX="hidden" pr={1}>
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 6 }}
        minH="100%"
      >
        <Flex justify="space-between" align={{ base: "stretch", lg: "center" }} mb={5} gap={4} direction={{ base: "column", lg: "row" }}>
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
              Food Management
            </Text>
            <Text color="gray.600" mt={1}>
              Organize recipes, review content, and keep the catalog clean.
            </Text>
          </Box>

          <HStack spacing={3} flexWrap="wrap" align="center">
            <Button
              leftIcon={<FiPlus />}
              bg={colors.primary}
              color="white"
              borderRadius="full"
              _hover={{ bg: colors.dark }}
              onClick={() => navigate("/admin/add-food")}
              w={{ base: "100%", sm: "auto" }}
            >
              Add Food
            </Button>

            {!selectionMode ? (
              <Button
                leftIcon={<FiCheckSquare />}
                bg="#edf4ff"
                color={colors.darkest}
                borderRadius="full"
                _hover={{ bg: colors.chipHover }}
                onClick={() => setSelectionMode(true)}
                w={{ base: "100%", sm: "auto" }}
              >
                Select
              </Button>
            ) : (
              <>
                <Button
                  leftIcon={<FiTrash2 />}
                  bg="red.50"
                  color="red.600"
                  borderRadius="full"
                  _hover={{ bg: "red.100" }}
                  onClick={handleDeleteSelected}
                  isDisabled={selectedFoodIds.length === 0}
                  w={{ base: "100%", sm: "auto" }}
                >
                  Delete Selected{selectedFoodIds.length > 0 ? ` (${selectedFoodIds.length})` : ""}
                </Button>
                <Button
                  leftIcon={<FiX />}
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="full"
                  _hover={{ bg: "gray.200" }}
                  onClick={handleCancelSelection}
                  w={{ base: "100%", sm: "auto" }}
                >
                  Cancel
                </Button>
              </>
            )}
          </HStack>
        </Flex>

        <Flex justify="space-between" align={{ base: "stretch", md: "center" }} gap={4} mb={6} direction={{ base: "column", md: "row" }}>
          <HStack gap={3} flexWrap="wrap">
            <Badge bg="#edf4ff" color={colors.darkest} px={3} py={1.5} borderRadius="full">
              Total Foods: {foods.length}
            </Badge>
            <Badge bg="#f8fbff" color={colors.darkest} px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="#dbe5f4">
              Visible: {visibleFoods.length}/{filteredFoods.length}
            </Badge>
            <Badge bg="#f8fbff" color={colors.darkest} px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="#dbe5f4">
              With Links: {linkedFoodsCount}
            </Badge>
          </HStack>

          <InputGroup maxW={{ base: "100%", md: "340px" }} startElement={<FiSearch size="16" color="#718096" />}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food, description, category"
              bg="white"
              borderRadius="full"
              border="1px solid"
              borderColor="#dbe5f4"
            />
          </InputGroup>
        </Flex>

        <Box w="100%" maxW="1250px" mx="auto" minW={0}>
          {!selectionMode ? (
            <></>
          ) : (
            <Text fontSize="sm" color="gray.500" mb={4}>
              Selection mode is active. Tap cards to select multiple foods for deletion.
            </Text>
          )}

          {loading ? (
            <Flex py={16} justify="center" align="center" direction="column" gap={3}>
              <Spinner color={colors.primary} size="lg" />
              <Text color="gray.600">Loading foods...</Text>
            </Flex>
          ) : filteredFoods.length === 0 ? (
            <Box
              bg="#fbfdff"
              border="1px solid"
              borderColor="#dbe5f4"
              borderRadius="18px"
              p={10}
              textAlign="center"
            >
              <Text fontWeight="700" color={colors.darkest} mb={2}>
                No foods matched your search.
              </Text>
              <Text color="gray.600">
                Try a different keyword or add a new recipe to the library.
              </Text>
            </Box>
          ) : (
            <Grid
              w="100%"
              minW={0}
              templateColumns={{ base: "minmax(0, 1fr)", "2xl": "repeat(2, minmax(0, 1fr))" }}
              columnGap={6}
              rowGap={6}
            >
              {visibleFoods.map((food) => (
                <GridItem key={food.food_id} minW={0}>
                  <AdminFoodCard
                    food={food}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectionMode={selectionMode}
                    isSelected={selectedFoodIds.includes(food.food_id)}
                    onToggleSelect={handleToggleSelect}
                  />
                </GridItem>
              ))}
            </Grid>
          )}

          {!loading && hasMoreFoods && (
            <Flex justify="center" mt={6}>
              <Button
                bg="#edf4ff"
                color={colors.darkest}
                borderRadius="full"
                _hover={{ bg: colors.chipHover }}
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + ADMIN_PAGE_BATCH_SIZE, filteredFoods.length),
                  )
                }
              >
                See More
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}
