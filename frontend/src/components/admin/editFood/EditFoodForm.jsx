import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
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
import { useApp } from "../../../context/AppProvider.jsx";
import {
  getFoodById,
  updateFood,
  deleteFood,
} from "../../../services/api/food.service";
import { getAllCategories } from "../../../services/api/category.service";
import { getAllIngredients } from "../../../services/api/ingredient.service";
import { colors } from "../../../theme/tokens.js";

export default function EditFoodForm({ foodId }) {
  const navigate = useNavigate();
  const { refreshFoods, selectedIds } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Load food, categories, and ingredients from database
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getFoodById(foodId), getAllCategories(), getAllIngredients()])
      .then(([foodData, categoryData, ingredientData]) => {
        setTitle(foodData.title);
        setDescription(foodData.description);
        setLinkUrl(foodData.link_url);
        setSelectedCategory(foodData.categories?.[0] || null);
        setSelectedIngredients(foodData.ingredients || []);
        setCategories(categoryData);
        setIngredients(ingredientData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load food or options.");
        setLoading(false);
      });
  }, [foodId]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const name = cat.name || cat.category_name || cat;
      return name.toLowerCase().includes(categorySearch.toLowerCase());
    });
  }, [categorySearch, categories]);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const name = ing.name || ing.ingredient_name || ing;
      // Exclude already selected ingredients by id or name
      return (
        name.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
        !selectedIngredients.some(
          (sel) =>
            sel.ingredient_id === ing.ingredient_id ||
            sel === ing.ingredient_id ||
            sel === name,
        )
      );
    });
  }, [ingredientSearch, selectedIngredients, ingredients]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategorySearch(category.name || category.category_name || "");
    setShowCategoryDropdown(false);
  };

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
    setIngredientSearch("");
    setShowIngredientDropdown(false);
  };

  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.filter(
        (item) =>
          item !== ingredient &&
          item.ingredient_id !== ingredient.ingredient_id &&
          (item.name || item.ingredient_name) !==
            (ingredient.name || ingredient.ingredient_name),
      ),
    );
  };

  const handleClearAllIngredients = () => {
    setSelectedIngredients([]);
    setIngredientSearch("");
    setShowIngredientDropdown(false);
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      const updatedFood = await updateFood(foodId, {
        title,
        description,
        ingredientIds: selectedIngredients.map((i) => i.ingredient_id || i),
        categoryIds: selectedCategory
          ? [selectedCategory.category_id || selectedCategory]
          : [],
        link_url: linkUrl,
        imageFile,
      });
      await refreshFoods(selectedIds);
      alert("Food updated successfully!");
      navigate("/admin/foods", {
        state: { updatedFood },
      });
    } catch (err) {
      setError("Failed to update food.");
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?",
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      await deleteFood(foodId);
      await refreshFoods(selectedIds);
      alert("Food deleted successfully!");
      navigate("/admin/foods");
    } catch (err) {
      setError("Failed to delete food.");
    }
    setLoading(false);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box
      border="1px solid"
      borderColor="#dbe5f4"
      bg="#fbfdff"
      borderRadius="18px"
      boxShadow="0 8px 24px rgba(79,121,189,0.08)"
      overflow="hidden"
    >
      <Box
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 5 }}
        bg="#fbfdff"
        borderBottom="1px solid"
        borderColor="#dbe5f4"
      >
        <HStack justify="space-between" align={{ base: "stretch", md: "center" }} flexDirection={{ base: "column", md: "row" }} gap={3}>
          <Box>
            <Heading size="lg" color={colors.darkest}>
              Edit Food
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Update recipe details with a clean, structured form.
            </Text>
          </Box>

          <Button
            type="submit"
            form="edit-food-form"
            bg={colors.primary}
            color="white"
            borderRadius="full"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="700"
            _hover={{ bg: colors.dark }}
            leftIcon={<FiSave />}
            w={{ base: "100%", md: "auto" }}
          >
            Save Changes
          </Button>
        </HStack>
      </Box>

      <VStack
        as="form"
        id="edit-food-form"
        onSubmit={handleSubmit}
        spacing={5}
        align="stretch"
        px={{ base: 4, md: 8 }}
        py={{ base: 5, md: 6 }}
      >
        <Flex justify="start" align="start" wrap="wrap" gap={3}>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Food ID
            </Text>
            <Text fontSize="lg" fontWeight="700" color={colors.darkest}>
              {foodId}
            </Text>
          </Box>
        </Flex>

        <Separator borderColor="#dbe5f4" />

        <Box>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Title
          </Text>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit title"
            bg="white"
            borderRadius="12px"
            h="46px"
            border="1px solid"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />
        </Box>

        <Box>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Description
          </Text>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Edit description"
            bg="white"
            borderRadius="12px"
            minH="120px"
            border="1px solid"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />
        </Box>

        <Box position="relative">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Category
          </Text>

          <Input
            value={categorySearch}
            onFocus={() => setShowCategoryDropdown(true)}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
            }}
            placeholder="Search category"
            bg="white"
            borderRadius="12px"
            h="46px"
            border="1px solid"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />

          {showCategoryDropdown &&
            categorySearch &&
            filteredCategories.length > 0 && (
              <Box
                mt={2}
                bg="white"
                borderRadius="12px"
                border="1px solid"
                borderColor="#dbe5f4"
                boxShadow="md"
                maxH="180px"
                overflowY="auto"
                position="absolute"
                w="100%"
                zIndex={20}
              >
                {filteredCategories.map((category) => (
                  <Box
                    key={category.category_id || category.id || category.name}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onMouseDown={() => handleSelectCategory(category)}
                  >
                    {category.name || category.category_name || category}
                  </Box>
                ))}
              </Box>
            )}
          {selectedCategory && (
            <Box
              mt={2}
              px={4}
              py={2}
              bg={colors.chipBg}
              borderRadius="md"
              display="inline-block"
            >
              <Text fontSize="sm" color={colors.darkest}>
                {selectedCategory.name ||
                  selectedCategory.category_name ||
                  selectedCategory}
              </Text>
            </Box>
          )}
        </Box>

        <Box position="relative">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Ingredient List
          </Text>

          <Input
            value={ingredientSearch}
            onFocus={() => setShowIngredientDropdown(true)}
            onChange={(e) => {
              setIngredientSearch(e.target.value);
              setShowIngredientDropdown(true);
            }}
            placeholder="Search ingredients"
            bg="white"
            borderRadius="12px"
            h="46px"
            border="1px solid"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />

          {showIngredientDropdown &&
            ingredientSearch &&
            filteredIngredients.length > 0 && (
              <Box
                mt={2}
                bg="white"
                borderRadius="12px"
                border="1px solid"
                borderColor="#dbe5f4"
                boxShadow="md"
                maxH="180px"
                overflowY="auto"
                position="absolute"
                w="100%"
                zIndex={20}
              >
                {filteredIngredients.map((ingredient) => (
                  <Box
                    key={
                      ingredient.ingredient_id ||
                      ingredient.id ||
                      ingredient.name
                    }
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onMouseDown={() => handleAddIngredient(ingredient)}
                  >
                    {ingredient.name ||
                      ingredient.ingredient_name ||
                      ingredient}
                  </Box>
                ))}
              </Box>
            )}

          {selectedIngredients.length > 0 && (
            <>
              <Wrap mt={4} spacing={3}>
                {selectedIngredients.map((ingredient) => (
                  <WrapItem
                    key={
                      ingredient.ingredient_id ||
                      ingredient.id ||
                      ingredient.name
                    }
                  >
                    <HStack
                      bg={colors.chipBg}
                      color={colors.darkest}
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid"
                      borderColor="#dbe5f4"
                    >
                      <Text fontSize="sm">
                        {ingredient.name ||
                          ingredient.ingredient_name ||
                          ingredient}
                      </Text>
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
                bg="red.50"
                color="red.600"
                borderRadius="full"
                _hover={{ bg: "red.100" }}
                onClick={handleClearAllIngredients}
              >
                Clear ingredients
              </Button>
            </>
          )}
        </Box>

        <Box>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Link URL
          </Text>
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Edit link URL"
            bg="white"
            borderRadius="12px"
            h="46px"
            border="1px solid"
            borderColor="#dbe5f4"
            _focusVisible={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
          />
        </Box>

        <HStack justify="space-between" pt={2} flexWrap="wrap" gap={3} align="stretch">
          <ImageUploadButton onChange={handleImageChange} />
          <Button
            onClick={handleDelete}
            bg="red.50"
            color="red.600"
            borderRadius="full"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="700"
            _hover={{ bg: "red.100" }}
            leftIcon={<FiTrash2 />}
            w={{ base: "100%", md: "auto" }}
            type="button"
          >
            Delete Food
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
