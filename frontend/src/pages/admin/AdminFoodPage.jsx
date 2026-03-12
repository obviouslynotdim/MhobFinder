import {
    Box,
    Grid,
    GridItem,
    Text,
    HStack,
    Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckSquare, FiTrash2, FiX } from "react-icons/fi";
import AdminFoodCard from "../../components/AdminFoodCard.jsx";

const initialFoods = [
    {
        food_id: 1,
        title: "Amok Trey",
        category: "Khmer Food",
        isVegan: false,
        description: "Steamed fish with coconut curry and herbs.",
        image_url: "https://via.placeholder.com/300x300.png?text=Amok+Trey",
        link_url: "https://example.com/amok-trey",
        ingredients: ["Fish", "Garlic", "Kaffir Lime Leaf", "Coconut Milk"],
        status: "Published",
    },
    {
        food_id: 2,
        title: "Vegetable Stir Fry",
        category: "Healthy",
        isVegan: true,
        description: "Fresh vegetables stir-fried with light sauce.",
        image_url: "https://via.placeholder.com/300x300.png?text=Vegetable+Stir+Fry",
        link_url: "https://example.com/vegetable-stir-fry",
        ingredients: ["Broccoli", "Carrot", "Garlic"],
        status: "Published",
    },
    {
        food_id: 3,
        title: "Lok Lak",
        category: "Khmer Food",
        isVegan: false,
        description: "Stir-fried beef served with pepper lime sauce.",
        image_url: "https://via.placeholder.com/300x300.png?text=Lok+Lak",
        link_url: "https://example.com/lok-lak",
        ingredients: ["Beef", "Tomato", "Onion"],
        status: "Draft",
    },
    {
        food_id: 4,
        title: "Pumpkin Soup",
        category: "Soup",
        isVegan: true,
        description: "Creamy pumpkin soup with coconut milk.",
        image_url: "https://via.placeholder.com/300x300.png?text=Pumpkin+Soup",
        link_url: "https://example.com/pumpkin-soup",
        ingredients: ["Pumpkin", "Coconut Milk", "Salt"],
        status: "Published",
    },
    {
        food_id: 5,
        title: "Khmer Red Curry",
        category: "Curry",
        isVegan: false,
        description: "Traditional curry with coconut milk and tender meat.",
        image_url: "https://via.placeholder.com/300x300.png?text=Khmer+Red+Curry",
        link_url: "https://example.com/khmer-red-curry",
        ingredients: ["Chicken", "Coconut Milk", "Curry Paste"],
        status: "Published",
    },
    {
        food_id: 6,
        title: "Mango Sticky Rice",
        category: "Dessert",
        isVegan: true,
        description: "Sweet ripe mango with creamy coconut sticky rice.",
        image_url: "https://via.placeholder.com/300x300.png?text=Mango+Sticky+Rice",
        link_url: "https://example.com/mango-sticky-rice",
        ingredients: ["Mango", "Rice", "Coconut Milk"],
        status: "Draft",
    },
];

export default function AdminFoodPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [foods, setFoods] = useState(initialFoods);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedFoodIds, setSelectedFoodIds] = useState([]);

    useEffect(() => {
        const updatedFood = location.state?.updatedFood;
        if (!updatedFood) return;

        setFoods((prev) =>
            prev.map((food) =>
                food.food_id === updatedFood.food_id ? updatedFood : food
            )
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

    const handleDelete = (foodId) => {
        const confirmed = window.confirm("Are you sure you want to delete this food?");
        if (!confirmed) return;

        setFoods((prev) => prev.filter((food) => food.food_id !== foodId));
        setSelectedFoodIds((prev) => prev.filter((id) => id !== foodId));
    };

    const handleToggleSelect = (foodId) => {
        setSelectedFoodIds((prev) =>
            prev.includes(foodId)
                ? prev.filter((id) => id !== foodId)
                : [...prev, foodId]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedFoodIds.length === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedFoodIds.length} selected food(s)?`
        );
        if (!confirmed) return;

        setFoods((prev) =>
            prev.filter((food) => !selectedFoodIds.includes(food.food_id))
        );
        setSelectedFoodIds([]);
        setSelectionMode(false);
    };

    const handleCancelSelection = () => {
        setSelectionMode(false);
        setSelectedFoodIds([]);
    };

    return (
        <Box px={6} py={6}>
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
                                {selectedFoodIds.length > 0 ? ` (${selectedFoodIds.length})` : ""}
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
            </Box>
        </Box>
    );
}