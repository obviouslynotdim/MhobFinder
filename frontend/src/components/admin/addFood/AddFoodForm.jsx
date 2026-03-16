import { useMemo, useState, useEffect, useRef } from "react";
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
import { FiPlusSquare, FiX, FiImage, FiChevronDown } from "react-icons/fi";
import { colors } from "../../../theme/tokens.js";
import { useAdminAlert } from "../../../context/AdminAlertContext.jsx";

import { getAllCategories } from "../../../services/api/category.service.js";
import { getAllIngredients } from "../../../services/api/ingredient.service.js";
import { addFood } from "../../../services/api/food.service.js";

export default function AddFoodForm() {
  const { refreshFoods } = useApp();
  const { showAlert } = useAdminAlert();

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
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef(null);

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
    handleSelectImage(file);
  };

  const handleSelectImage = (file) => {
    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError("");
    setImageFile(file);
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(null);
    setCategorySearch("");
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

      showAlert({
        tone: "success",
        title: "Food Added",
        description: "The new recipe has been added successfully.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLinkUrl("");
      setSelectedCategory(null);
      setCategorySearch("");
      setSelectedIngredients([]);
      setImageFile(null);
    } catch {
      showAlert({
        tone: "error",
        title: "Add Failed",
        description: "Could not add the food. Please try again.",
      });
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
              pr="40px"
            />
            <Button
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              size="sm"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              p={0}
              minW="auto"
              h="auto"
              _hover={{ bg: "transparent" }}
            >
              <FiChevronDown 
                size={20} 
                style={{ 
                  transition: "transform 0.2s",
                  transform: showCategoryDropdown ? "rotate(180deg)" : "rotate(0deg)"
                }} 
              />
            </Button>
          </Box>

          {showCategoryDropdown && (categorySearch ? filteredCategories : categories).length > 0 && (
            <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" maxH="220px" overflowY="auto" position="absolute" w="100%" zIndex={10} boxShadow="md">
              {(categorySearch ? filteredCategories : categories).map((category) => (
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

          {showCategoryDropdown && 
            !categorySearch &&
            (categorySearch ? filteredCategories : categories).length === 0 && (
              <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" px={3} py={2} position="absolute" w="100%" zIndex={10} boxShadow="md">
                <Text fontSize="sm" color="gray.500">
                  No categories found
                </Text>
              </Box>
            )}

          {selectedCategory && (
            <Box
              mt={2}
              px={4}
              py={2}
              bg={colors.chipBg}
              borderRadius="md"
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Text fontSize="sm" color={colors.darkest}>
                {selectedCategory.name}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleRemoveCategory}
                p={0}
                minW="auto"
                h="auto"
                _hover={{ bg: "transparent", opacity: 0.7 }}
              >
                <FiX size={16} />
              </Button>
            </Box>
          )}
        </Box>

        {/* Ingredients */}
        <Box position="relative">
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
              pr="40px"
            />
            <Button
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              size="sm"
              onClick={() => setShowIngredientDropdown(!showIngredientDropdown)}
              p={0}
              minW="auto"
              h="auto"
              _hover={{ bg: "transparent" }}
            >
              <FiChevronDown 
                size={20} 
                style={{ 
                  transition: "transform 0.2s",
                  transform: showIngredientDropdown ? "rotate(180deg)" : "rotate(0deg)"
                }} 
              />
            </Button>
          </Box>

          {showIngredientDropdown && (ingredientSearch ? filteredIngredients : ingredients.filter(ing => !selectedIngredients.some(sel => sel.ingredient_id === ing.ingredient_id))).length > 0 && (
            <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" maxH="220px" overflowY="auto" position="absolute" w="100%" zIndex={10} boxShadow="md">
              {(ingredientSearch ? filteredIngredients : ingredients.filter(ing => !selectedIngredients.some(sel => sel.ingredient_id === ing.ingredient_id))).map((ingredient) => (
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

          {showIngredientDropdown && 
            !ingredientSearch &&
            (ingredientSearch ? filteredIngredients : ingredients.filter(ing => !selectedIngredients.some(sel => sel.ingredient_id === ing.ingredient_id))).length === 0 && (
              <Box bg="white" border="1px solid #dbe5f4" mt={2} borderRadius="14px" px={3} py={2} position="absolute" w="100%" zIndex={10} boxShadow="md">
                <Text fontSize="sm" color="gray.500">
                  No ingredients available
                </Text>
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
        <Box>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Upload Image
          </Text>
          <Box
            border="2px dashed"
            borderColor={isDraggingImage ? colors.primary : "#BFD3F3"}
            borderRadius="16px"
            px={{ base: 4, md: 5 }}
            py="6"
            bg={isDraggingImage ? "#EDF4FF" : "#F8FBFF"}
            transition="all 0.2s ease"
            cursor="pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingImage(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingImage(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingImage(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingImage(false);
              handleSelectImage(event.dataTransfer?.files?.[0] || null);
            }}
          >
            <VStack gap="2" textAlign="center" align="center">
              <Text fontSize="sm" fontWeight="700" color={colors.darkest}>
                Drag and drop a food image here
              </Text>
              <Text fontSize="xs" color="gray.600">
                or click to browse from your device
              </Text>
              {imageFile && (
                <Text fontSize="xs" color={colors.primary} fontWeight="600">
                  Selected: {imageFile.name}
                </Text>
              )}
            </VStack>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
            />
          </Box>

          {imageFile && (
            <Button
              mt={3}
              size="sm"
              variant="outline"
              borderColor="#BFD3F3"
              onClick={clearSelectedImage}
              w="100%"
            >
              Clear Image
            </Button>
          )}
        </Box>

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
