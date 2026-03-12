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
    Separator,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiTrash2, FiX } from "react-icons/fi";
import ImageUploadButton from "../addFood/ImageUploadButton";

export default function EditFoodForm({ food }) {
    const navigate = useNavigate();

    const [foodId] = useState(food?.food_id ?? 0);
    const [title, setTitle] = useState(food?.title ?? "");
    const [description, setDescription] = useState(food?.description ?? "");
    const [linkUrl, setLinkUrl] = useState(food?.link_url ?? "");
    const [status, setStatus] = useState(food?.status ?? "Published");

    const [categorySearch, setCategorySearch] = useState(food?.category ?? "");
    const [selectedCategory, setSelectedCategory] = useState(food?.category ?? "");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [ingredientSearch, setIngredientSearch] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState(
        food?.ingredients ?? []
    );
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
        "Healthy",
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
        "Mushroom",
        "Lemongrass",
        "Kaffir Lime Leaf",
        "Basil",
        "Coriander",
        "Mint",
        "Coconut Milk",
        "Lime",
        "Rice",
        "Rice Noodles",
        "Egg",
        "Salt",
        "Black Pepper",
        "Chili",
        "Fish Sauce",
        "Soy Sauce",
        "Oyster Sauce",
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

    const handleSave = () => {
        const updatedFood = {
            ...food,
            food_id: foodId,
            title,
            description,
            category: selectedCategory,
            ingredients: selectedIngredients,
            link_url: linkUrl,
            status,
            image_url: imageFile
                ? URL.createObjectURL(imageFile)
                : food?.image_url ?? "",
        };

        navigate("/admin/foods", {
            state: { updatedFood },
        });
    };

    const handleDelete = () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this food?"
        );
        if (!confirmed) return;

        alert("Delete can be connected later.");
    };

    return (
        <Box border="2px solid" borderColor="gray.300" bg="#c8d4ea">
            <Box bg="#4f79bd" px={6} py={5}>
                <Heading size="lg" color="white">
                    Edit Food
                </Heading>
            </Box>

            <VStack spacing={6} align="stretch" px={10} py={8}>
                <HStack justify="space-between" align="start" flexWrap="wrap">
                    <Box>
                        <Text fontSize="sm" color="gray.600">
                            Food ID
                        </Text>
                        <Text fontSize="lg" fontWeight="700" color="gray.700">
                            {foodId}
                        </Text>
                    </Box>

                    <Box>
                        <Text fontSize="sm" color="gray.600">
                            Status
                        </Text>
                        <Text fontSize="lg" fontWeight="700" color="gray.700">
                            {status}
                        </Text>
                    </Box>
                </HStack>

                <Separator borderColor="gray.300" />

                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Title
                    </Text>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Edit title ..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />
                </Box>

                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Description
                    </Text>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Edit description ..."
                        bg="white"
                        borderRadius="18px"
                        minH="120px"
                        border="none"
                    />
                </Box>

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

                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Link URL
                    </Text>
                    <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Edit link URL ..."
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                    />
                </Box>

                <Box>
                    <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                        Status
                    </Text>
                    <Box
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        bg="white"
                        borderRadius="18px"
                        h="52px"
                        border="none"
                        px={4}
                        w="100%"
                    >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Hidden">Hidden</option>
                    </Box>
                </Box>

                <HStack justify="space-between" pt={2} flexWrap="wrap" gap={4}>
                    <ImageUploadButton onChange={handleImageChange} />

                    <HStack gap={4}>
                        <Button
                            onClick={handleDelete}
                            bg="red.500"
                            color="white"
                            borderRadius="18px"
                            px={8}
                            py={7}
                            fontSize="lg"
                            fontWeight="700"
                            _hover={{ bg: "red.600" }}
                        >
                            <FiTrash2 style={{ marginRight: "8px" }} />
                            Delete
                        </Button>

                        <Button
                            onClick={handleSave}
                            bg="#4f79bd"
                            color="white"
                            borderRadius="18px"
                            px={8}
                            py={7}
                            fontSize="lg"
                            fontWeight="700"
                            _hover={{ bg: "#4269a8" }}
                        >
                            <FiSave style={{ marginRight: "8px" }} />
                            Save Changes
                        </Button>
                    </HStack>
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