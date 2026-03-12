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
import { FiPlusSquare, FiX, FiImage } from "react-icons/fi";

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
        "Chicken",
        "Beef",
        "Pork",
        "Duck",
        "Fish",
        "Shrimp",
        "Crab",
        "Squid",
        "Onion",
        "Garlic",
        "Tomato",
        "Eggplant",
        "Cabbage",
        "Carrot",
        "Potato",
        "Lemongrass",
        "Basil",
        "Coriander",
        "Mint",
        "Coconut",
        "Lime",
        "Banana",
        "Mango",
        "Rice",
        "Noodles",
        "Bread",
        "Milk",
        "Butter",
        "Cheese",
        "Egg",
        "Salt",
        "Pepper",
        "Chili",
        "Turmeric",
        "Fish Sauce",
        "Soy Sauce",
        "Oyster Sauce",
        "Curry Paste",
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

        console.log(newFood);
        alert("Food added (frontend only)");
    };

    const labelStyle = {
        fontSize: "lg",
        fontWeight: "700",
        color: "gray.600",
        mb: 1,
    };

    const inputStyle = {
        bg: "white",
        borderRadius: "18px",
        h: "60px",
        border: "none",
        boxShadow: "sm",
    };

    return (
        <Box
            w="100%"
            maxW="720px"
            mx="auto"
            bg="#cfdaf0"
            borderRadius="22px"
            overflow="hidden"
        >
            <Box bg="#4f79bd" px={6} py={5}>
                <Heading size="md" color="white">
                    Add New Food
                </Heading>
            </Box>

            <VStack spacing={4} align="stretch" px={7} py={6}>
                <Box>
                    <Text {...labelStyle}>Title</Text>
                    <Input
                        {...inputStyle}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add title ..."
                    />
                </Box>

                <Box>
                    <Text {...labelStyle}>Description</Text>
                    <Textarea
                        bg="white"
                        borderRadius="18px"
                        minH="90px"
                        border="none"
                        boxShadow="sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add description ..."
                    />
                </Box>

                <Box position="relative">
                    <Text {...labelStyle}>Category</Text>

                    <Input
                        {...inputStyle}
                        value={categorySearch}
                        onFocus={() => setShowCategoryDropdown(true)}
                        onChange={(e) => {
                            setCategorySearch(e.target.value);
                            setShowCategoryDropdown(true);
                        }}
                        placeholder="Search category..."
                    />

                    {showCategoryDropdown && filteredCategories.length > 0 && (
                        <Box
                            mt={2}
                            bg="white"
                            borderRadius="14px"
                            boxShadow="md"
                            position="absolute"
                            w="100%"
                            zIndex={10}
                            maxH="180px"
                            overflowY="auto"
                        >
                            {filteredCategories.map((category) => (
                                <Box
                                    key={category}
                                    px={4}
                                    py={2}
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

                <Box position="relative">
                    <Text {...labelStyle}>Ingredient list</Text>

                    <Input
                        {...inputStyle}
                        value={ingredientSearch}
                        onFocus={() => setShowIngredientDropdown(true)}
                        onChange={(e) => {
                            setIngredientSearch(e.target.value);
                            setShowIngredientDropdown(true);
                        }}
                        placeholder="Search ingredients..."
                    />

                    {showIngredientDropdown && filteredIngredients.length > 0 && (
                        <Box
                            mt={2}
                            bg="white"
                            borderRadius="14px"
                            boxShadow="md"
                            position="absolute"
                            w="100%"
                            zIndex={10}
                            maxH="180px"
                            overflowY="auto"
                        >
                            {filteredIngredients.map((ingredient) => (
                                <Box
                                    key={ingredient}
                                    px={4}
                                    py={2}
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
                        <Box mt={2}>
                            <Box
                                maxH="100px"
                                overflowY="auto"
                                overflowX="hidden"
                                pr={1}
                                borderRadius="12px"
                            >
                                <Wrap spacing={2}>
                                    {selectedIngredients.map((ingredient) => (
                                        <WrapItem key={ingredient}>
                                            <HStack
                                                bg="#4f79bd"
                                                color="white"
                                                px={3}
                                                py={1.5}
                                                borderRadius="full"
                                                fontSize="sm"
                                                flexShrink={0}
                                            >
                                                <Text>{ingredient}</Text>

                                                <Box
                                                    as="button"
                                                    onClick={() => handleRemoveIngredient(ingredient)}
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <FiX size={14} />
                                                </Box>
                                            </HStack>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            </Box>

                            <Button
                                mt={1}
                                size="sm"
                                bg="red.100"
                                color="red.600"
                                borderRadius="full"
                                _hover={{ bg: "red.200" }}
                                onClick={handleClearAllIngredients}
                            >
                                Clear ingredients
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box>
                    <Text {...labelStyle}>Link URL</Text>
                    <Input
                        {...inputStyle}
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Add link URL ..."
                    />
                </Box>

                <HStack pt={4} justify="space-between">
                    <Button
                        leftIcon={<FiImage />}
                        bg="#4f79bd"
                        color="white"
                        width="210px"
                        height="60px"
                        borderRadius="16px"
                        fontSize="xl"
                        fontWeight="700"
                        _hover={{ bg: "#4269a8" }}
                    >
                        Insert IMG
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        leftIcon={<FiPlusSquare />}
                        bg="#4f79bd"
                        color="white"
                        width="210px"
                        height="60px"
                        borderRadius="16px"
                        fontSize="xl"
                        fontWeight="700"
                        _hover={{ bg: "#4269a8" }}
                    >
                        Add Food
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}