import { useMemo, useState, useEffect } from "react";
import { useApp } from "../../context/AppProvider.jsx";
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

import { getAllCategories } from "../../services/api/category.service.js";
import { getAllIngredients } from "../../services/api/ingredient.service.js";
import { addFood } from "../../services/api/food.service.js";

export default function AddFoodForm() {
  const { refreshFoods, selectedIds } = useApp();

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

  const handleClearAllIngredients = () => {
    setSelectedIngredients([]);
    setIngredientSearch("");
    setShowIngredientDropdown(false);
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
    } catch (err) {
      setError("Failed to add food to database.");
    }

    setLoading(false);
  };

  return (
    <Box
      w="100%"
      maxW="540px"
      mx="auto"
      bg="#f8fafc"
      borderRadius="2xl"
      boxShadow="2xl"
      border="1px solid #e2e8f0"
      overflowY="auto"
      maxHeight="92vh"
    >
      <Box
        bgGradient="linear(to-r, #4f79bd, #6fa8dc)"
        px={10}
        py={7}
        borderTopRadius="2xl"
      >
        <Heading size="lg" color="white" textAlign="center">
          Add New Food
        </Heading>
      </Box>

      <VStack spacing={6} px={10} py={8} align="stretch">
        {error && (
          <Box bg="red.50" color="red.600" p={3} borderRadius="md">
            {error}
          </Box>
        )}

        {/* Title */}
        <Input
          placeholder="Food title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <Textarea
          placeholder="Food description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          />

          {showCategoryDropdown && (
            <Box bg="white" border="1px solid #eee" mt={2}>
              {filteredCategories.map((category) => (
                <Box
                  key={category.category_id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
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
          />

          {showIngredientDropdown && (
            <Box bg="white" border="1px solid #eee" mt={2}>
              {filteredIngredients.map((ingredient) => (
                <Box
                  key={ingredient.ingredient_id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
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
                  bg="blue.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
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
        />

        {/* Image */}
        <Button as="label" leftIcon={<FiImage />}>
          Choose Image
          <Input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {imageFile && <Text>{imageFile.name}</Text>}

        <Button
          onClick={handleSubmit}
          leftIcon={<FiPlusSquare />}
          colorScheme="blue"
          isLoading={loading}
        >
          Add Food
        </Button>
      </VStack>
    </Box>
  );
}
