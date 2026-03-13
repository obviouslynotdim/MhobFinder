import { Box, Grid, GridItem, Text, HStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckSquare, FiTrash2, FiX } from "react-icons/fi";
import AdminFoodCard from "../../components/AdminFoodCard.jsx";
import { getAllFoods, deleteFood } from "../../services/api/food.service.js";

export default function AdminFoodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [foods, setFoods] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFoodIds, setSelectedFoodIds] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (e) {
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
    } catch (e) {
      alert("Failed to delete selected foods.");
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedFoodIds([]);
  };

  return (
    <Box px={6} py={6} minHeight="100vh" maxHeight="100vh" overflowY="auto">
      <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Text fontSize="2xl" fontWeight="bold">
          Manage Foods
        </Text>
        <HStack spacing={3}>
          {!selectionMode ? (
            <Button
              leftIcon={<FiCheckSquare />}
              bg="#4f79bd"
              color="white"
              borderRadius="full"
              _hover={{ bg: "#4269a8" }}
              onClick={() => setSelectionMode(true)}
            >
              Select
            </Button>
          ) : (
            <>
              <Button
                leftIcon={<FiTrash2 />}
                bg="red.100"
                color="red.600"
                borderRadius="full"
                _hover={{ bg: "red.200" }}
                onClick={handleDeleteSelected}
                isDisabled={selectedFoodIds.length === 0}
              >
                Delete Selected
                {selectedFoodIds.length > 0
                  ? ` (${selectedFoodIds.length})`
                  : ""}
              </Button>
              <Button
                leftIcon={<FiX />}
                bg="gray.200"
                color="gray.700"
                borderRadius="full"
                _hover={{ bg: "gray.300" }}
                onClick={handleCancelSelection}
              >
                Cancel
              </Button>
            </>
          )}
        </HStack>
      </HStack>
      <Box maxW="1250px" mx="auto">
        {loading ? (
          <Text>Loading foods…</Text>
        ) : (
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            columnGap={8}
            rowGap={8}
          >
            {foods.map((food) => (
              <GridItem key={food.food_id}>
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
      </Box>
    </Box>
  );
}
