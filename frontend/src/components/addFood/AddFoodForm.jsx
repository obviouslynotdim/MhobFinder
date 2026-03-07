import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Heading,
    HStack,
    Input,
    Text,
    Textarea,
    VStack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { FiPlusSquare, FiX } from "react-icons/fi";
import ImageUploadButton from "./ImageUploadButton";

export default function AddFoodForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const [categorySearch, setCategorySearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [ingredientSearch, setIngredientSearch] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);

    const [imageFile, setImageFile] = useState(null);

    const categories = [
        "Khmer Food",
        "European",
        "Seafood",
        "Dessert",
        "Street Food",
        "Curry",
        "Soup",
    ];

    const ingredients = [
        "Chicken", "Beef", "Pork", "Duck", "Sausage", "Fish", "Shrimp", "Crab", "Squid", "Prawn",
        "Onion", "Garlic", "Tomato", "Eggplant", "Cabbage", "Carrot", "Potato", "Bean Sprouts", "Mushroom",
        "Lemongrass", "Kaffir Lime Leaf", "Basil", "Coriander", "Mint",
        "Coconut", "Lime", "Banana", "Mango",
        "Rice", "Rice Noodles", "Spaghetti", "Bread",
        "Milk", "Butter", "Cheese", "Cream", "Egg",
        "Salt", "Black Pepper", "Chili", "Turmeric", "Paprika",
        "Fish Sauce", "Soy Sauce", "Oyster Sauce", "Tomato Sauce", "Curry Paste",
        "Sugar", "Palm Sugar", "Honey",
        "Vegetable Oil", "Olive Oil",
        "Wheat Flour", "Rice Flour", "Cornstarch",
    ];

    const filteredCategories = useMemo(() => {
        return categories.filter((item) =>
            item.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [categorySearch]);

    const filteredIngredients = useMemo(() => {
        return ingredients.filter(
            (item) =>
                item.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
                !selectedIngredients.includes(item)
        );
    }, [ingredientSearch, selectedIngredients]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCategorySearch(category);
        setShowCategoryDropdown(false);
    };

    const handleAddIngredient = (ingredient) => {
        setSelectedIngredients((prev) => [...prev, ingredient]);
        setIngredientSearch("");
        setShowIngredientDropdown(false);
    };

    const handleRemoveIngredient = (ingredient) => {
        setSelectedIngredients((prev) =>
            prev.filter((item) => item !== ingredient)
        );
    };

    const handleClearAllIngredients = () => {
        setSelectedIngredients([]);
        setIngredientSearch("");
        setShowIngredientDropdown(false);
    };

    const handleSubmit = () => {
        const newFood = {
            title,
            description,
            category: selectedCategory,
            ingredients: selectedIngredients,
            link_url: linkUrl,
            image: imageFile ? imageFile.name : null,
        };

        console.log("Food form data:", newFood);
        alert("Frontend only: food form submitted");

        setTitle("");
        setDescription("");
        setLinkUrl("");
        setCategorySearch("");
        setSelectedCategory("");
        setIngredientSearch("");
        setSelectedIngredients([]);
        setImageFile(null);
    };

    return (
        <Box border="2px solid" borderColor="gray.300" bg="#c8d4ea">
            <Box bg="#4f79bd" px={6} py={5}>
                <Heading size="lg" color="white">
                    Add New Food
                </Heading>
            </Box>

            <VStack spacing={6} align="stretch" px={10} py={8}>

                {/* TITLE */}
                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Title
                    </Text>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add title ..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />
                </Box>

                {/* DESCRIPTION */}
                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Description
                    </Text>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add description ..."
                        bg="white"
                        borderRadius="18px"
                        minH="52px"
                        border="none"
                    />
                </Box>

                {/* CATEGORY */}
                <Box position="relative">
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Category
                    </Text>

                    <Input
                        value={categorySearch}
                        onFocus={() => setShowCategoryDropdown(true)}
                        onChange={(e) => {
                            setCategorySearch(e.target.value);
                            setShowCategoryDropdown(true);
                        }}
                        placeholder="Search category..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />

                    {showCategoryDropdown &&
                        categorySearch &&
                        filteredCategories.length > 0 && (
                            <Box
                                mt={2}
                                bg="white"
                                borderRadius="14px"
                                boxShadow="md"
                                maxH="180px"
                                overflowY="auto"
                                position="absolute"
                                w="100%"
                                zIndex={20}
                            >
                                {filteredCategories.map((category) => (
                                    <Box
                                        key={category}
                                        px={4}
                                        py={3}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                        onMouseDown={() => handleSelectCategory(category)}
                                    >
                                        {category}
                                    </Box>
                                ))}
                            </Box>
                        )}
                </Box>

                {/* INGREDIENT */}
                <Box position="relative">
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Ingredient list
                    </Text>

                    <Input
                        value={ingredientSearch}
                        onFocus={() => setShowIngredientDropdown(true)}
                        onChange={(e) => {
                            setIngredientSearch(e.target.value);
                            setShowIngredientDropdown(true);
                        }}
                        placeholder="Search ingredients..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />

                    {showIngredientDropdown &&
                        ingredientSearch &&
                        filteredIngredients.length > 0 && (
                            <Box
                                mt={2}
                                bg="white"
                                borderRadius="14px"
                                boxShadow="md"
                                maxH="180px"
                                overflowY="auto"
                                position="absolute"
                                w="100%"
                                zIndex={20}
                            >
                                {filteredIngredients.map((ingredient) => (
                                    <Box
                                        key={ingredient}
                                        px={4}
                                        py={3}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                        onMouseDown={() => handleAddIngredient(ingredient)}
                                    >
                                        {ingredient}
                                    </Box>
                                ))}
                            </Box>
                        )}

                    {selectedIngredients.length > 0 && (
                        <>
                            <Wrap mt={4} spacing={3}>
                                {selectedIngredients.map((ingredient) => (
                                    <WrapItem key={ingredient}>
                                        <HStack
                                            bg="#4f79bd"
                                            color="white"
                                            px={4}
                                            py={2}
                                            borderRadius="full"
                                        >
                                            <Text fontSize="sm">{ingredient}</Text>
                                            <Box
                                                as="button"
                                                onClick={() => handleRemoveIngredient(ingredient)}
                                            >
                                                <FiX />
                                            </Box>
                                        </HStack>
                                    </WrapItem>
                                ))}
                            </Wrap>

                            <Button
                                mt={3}
                                size="xs"
                                bg="red.100"
                                color="red.600"
                                borderRadius="full"
                                _hover={{ bg: "red.200" }}
                                onClick={handleClearAllIngredients}
                            >
                                Clear ingredients
                            </Button>
                        </>
                    )}
                </Box>

                {/* LINK URL (MOVED HERE) */}
                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Link URL
                    </Text>
                    <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Add link URL ..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />
                </Box>

                {/* IMAGE + SUBMIT */}
                <HStack justify="space-between" pt={2} flexWrap="wrap" gap={4}>
                    <ImageUploadButton onChange={handleImageChange} />

                    <Button
                        onClick={handleSubmit}
                        bg="#4f79bd"
                        color="white"
                        borderRadius="18px"
                        px={10}
                        py={7}
                        fontSize="2xl"
                        fontWeight="700"
                        _hover={{ bg: "#4269a8" }}
                    >
                        <FiPlusSquare style={{ marginRight: "8px" }} />
                        Add Food
                    </Button>
                </HStack>

                {imageFile && (
                    <Text color="gray.600" fontSize="sm">
                        Selected image: {imageFile.name}
                    </Text>
                )}
            </VStack>
        </Box>
    );
}