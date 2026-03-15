import { useMemo, useState, useEffect } from "react";
import { useApp } from "../../../context/AppProvider.jsx";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FiPlusSquare, FiX, FiImage } from "react-icons/fi";
import { colors } from "../../../theme/tokens.js";

import { getAllCategories } from "../../../services/api/category.service.js";
import { getAllIngredients } from "../../../services/api/ingredient.service.js";
import { addFood } from "../../../services/api/food.service.js";

export default function AddFoodForm() {
  const { refreshFoods } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [ingredientSearch, setIngredientSearch] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    getAllIngredients()
      .then(setIngredients)
      .catch(() => setIngredients([]));
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categorySearch, categories]);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(
      (ing) =>
        ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
        !selectedIngredients.some(
          (sel) => sel.ingredient_id === ing.ingredient_id,
        ),
    );
  }, [ingredientSearch, selectedIngredients, ingredients]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
    setIngredientSearch("");
    setShowIngredientDropdown(false);
  };

  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item.ingredient_id !== ingredient.ingredient_id),
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !title.trim() ||
      !description.trim() ||
      !selectedCategory ||
      selectedIngredients.length === 0 ||
      !imageFile
    ) {
      setError("Please fill in all required fields, including image.");
      return;
    }

    setLoading(true);

    try {
      await addFood({
        title,
        description,
        ingredientIds: selectedIngredients.map((i) => i.ingredient_id),
        categoryIds: [selectedCategory.category_id],
        link_url: linkUrl,
        imageFile,
      });

      // Refresh all foods after adding
      await refreshFoods([]);

      alert("Food added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setLinkUrl("");
      setSelectedCategory(null);
      setCategorySearch("");
      setSelectedIngredients([]);
      setImageFile(null);
    } catch {
      setError("Failed to add food to database.");
    }

    setLoading(false);
  };

  return (
    <Box
      w="100%"
      maxW="980px"
      mx="auto"
      bg="#fbfdff"
      borderRadius={{ base: "16px", md: "22px" }}
      boxShadow="0 8px 22px rgba(79,121,189,0.08)"
      border="1px solid #dbe5f4"
      overflow="visible"
    >
      <VStack spacing={5} px={{ base: 4, md: 8 }} py={{ base: 5, md: 6 }} align="stretch">
        {error && (
          <Box bg="red.50" color="red.600" p={3} borderRadius="md" border="1px solid" borderColor="red.100">
            {error}
          </Box>
        )}

        <Flex direction={{ base: "column", md: "row" }} gap={3}>
          <Text fontSize="sm" color="gray.600">
            Fill in recipe details and save once all required fields are complete.
          </Text>
        </Flex>

        {/* Title */}
        <Input
          placeholder="Food title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          borderRadius="full"
          h="48px"
          bg="white"
          borderColor="#dbe5f4"
          _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
        />

        {/* Description */}
        <Textarea
          placeholder="Food description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          borderRadius="16px"
          minH="120px"
          bg="white"
          borderColor="#dbe5f4"
          _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
        />

        {/* Category */}
        <Box position="relative">
          <Input
            placeholder="Search category..."
            value={categorySearch}
            onFocus={() => setShowCategoryDropdown(true)}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
            }}
            borderRadius="full"
            h="48px"
            bg="white"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />

          {showCategoryDropdown && (
            <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" maxH="220px" overflowY="auto" position="absolute" w="100%" zIndex={10} boxShadow="md">
              {filteredCategories.map((category) => (
                <Box
                  key={category.category_id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "#f8fbff" }}
                  onMouseDown={() => handleSelectCategory(category)}
                >
                  {category.name}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Ingredients */}
        <Box position="relative">
          <Input
            placeholder="Search ingredients..."
            value={ingredientSearch}
            onFocus={() => setShowIngredientDropdown(true)}
            onChange={(e) => {
              setIngredientSearch(e.target.value);
              setShowIngredientDropdown(true);
            }}
            borderRadius="full"
            h="48px"
            bg="white"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />

          {showIngredientDropdown && (
            <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" maxH="220px" overflowY="auto" position="absolute" w="100%" zIndex={10} boxShadow="md">
              {filteredIngredients.map((ingredient) => (
                <Box
                  key={ingredient.ingredient_id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "#f8fbff" }}
                  onMouseDown={() => handleAddIngredient(ingredient)}
                >
                  {ingredient.name}
                </Box>
              ))}
            </Box>
          )}

          <Wrap mt={2}>
            {selectedIngredients.map((ingredient) => (
              <WrapItem key={ingredient.ingredient_id}>
                <HStack
                  bg="#edf4ff"
                  color={colors.darkest}
                  px={3}
                  py={1}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="#dbe5f4"
                >
                  <Text>{ingredient.name}</Text>
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
        </Box>

        {/* Link */}
        <Input
          placeholder="Recipe link (optional)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          borderRadius="full"
          h="48px"
          bg="white"
          borderColor="#dbe5f4"
          _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
        />

        {/* Image */}
        <HStack gap={3} flexWrap="wrap">
          <Button
            as="label"
            leftIcon={<FiImage />}
            bg="#edf4ff"
            color={colors.darkest}
            borderRadius="full"
            border="1px solid"
            borderColor="#dbe5f4"
            _hover={{ bg: colors.chipHover }}
          >
            Choose Image
            <Input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {imageFile && (
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {imageFile.name}
            </Text>
          )}
        </HStack>

        <Button
          onClick={handleSubmit}
          leftIcon={<FiPlusSquare />}
          bg={colors.primary}
          color="white"
          borderRadius="full"
          _hover={{ bg: colors.dark }}
          loading={loading}
        >
          Add Food
        </Button>
      </VStack>
    </Box>
  );
}
