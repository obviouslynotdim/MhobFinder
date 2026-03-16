import { useMemo, useState, useEffect, useRef } from "react";
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
import { FiSave, FiTrash2, FiX, FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { useApp } from "../../../context/AppProvider.jsx";
import {
  getFoodById,
  updateFood,
  deleteFood,
} from "../../../services/api/food.service";
import { getAllCategories } from "../../../services/api/category.service";
import { getAllIngredients } from "../../../services/api/ingredient.service";
import { colors } from "../../../theme/tokens.js";
import { useAdminAlert } from "../../../context/AdminAlertContext.jsx";
import AppLoadingState from "../../common/AppLoadingState.jsx";

export default function EditFoodForm({ foodId }) {
  const navigate = useNavigate();
  const { refreshFoods, selectedIds } = useApp();
  const { showAlert, confirm } = useAdminAlert();

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
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [currentImageName, setCurrentImageName] = useState("");
  const fileInputRef = useRef(null);

  // Load food, categories, and ingredients from database
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getFoodById(foodId), getAllCategories(), getAllIngredients()])
      .then(([foodData, categoryData, ingredientData]) => {
        setTitle(foodData.title);
        setDescription(foodData.description);
        setLinkUrl(foodData.link_url || "");
        setSelectedCategory(foodData.categories?.[0] || null);
        setSelectedIngredients(foodData.ingredients || []);
        setCurrentImageName(foodData.image_url ? "Current image attached" : "");
        setCategories(categoryData);
        setIngredients(ingredientData);
        setLoading(false);
      })
      .catch(() => {
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

  const handleImageChange = (e) => {
    handleSelectImage(e.target.files?.[0] || null);
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategorySearch(category.name || category.category_name || "");
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
      showAlert({
        tone: "success",
        title: "Food Updated",
        description: "The recipe was updated successfully.",
      });
      navigate("/admin/foods", {
        state: { updatedFood },
      });
    } catch {
      showAlert({
        tone: "error",
        title: "Update Failed",
        description: "Could not update this recipe. Please try again.",
      });
      setError("Failed to update food.");
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      tone: "error",
      title: "Delete This Food?",
      description: "This action is permanent and cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteFood(foodId);
      await refreshFoods(selectedIds);
      showAlert({
        tone: "success",
        title: "Food Deleted",
        description: "The recipe has been removed successfully.",
      });
      navigate("/admin/foods");
    } catch {
      showAlert({
        tone: "error",
        title: "Delete Failed",
        description: "Could not delete this recipe. Please try again.",
      });
      setError("Failed to delete food.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLoadingState
        title="Loading food details"
        description="Preparing recipe data for editing."
        minH="300px"
      />
    );
  }
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
            <HStack mb={1} spacing={3} align="center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/foods")}
                color={colors.primary}
                _hover={{ bg: "#eef3fb" }}
                fontWeight="600"
                px={2}
              >
                <FiArrowLeft style={{ marginRight: "6px" }} />
                All Foods
              </Button>
            </HStack>
            <Heading size="lg" color={colors.darkest} fontWeight="800">
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

          <Box position="relative">
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
              pr="40px"
            />
            <Button
              position="absolute"
              right="2"
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

          {showCategoryDropdown &&
            (categorySearch ? filteredCategories : categories).length > 0 && (
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
                {(categorySearch ? filteredCategories : categories).map((category) => (
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
          {showCategoryDropdown && 
            !selectedCategory &&
            (categorySearch ? filteredCategories : categories).length === 0 && (
              <Box
                mt={2}
                bg="white"
                borderRadius="12px"
                border="1px solid"
                borderColor="#dbe5f4"
                boxShadow="md"
                px={4}
                py={3}
                position="absolute"
                w="100%"
                zIndex={20}
              >
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
                {selectedCategory.name ||
                  selectedCategory.category_name ||
                  selectedCategory}
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

        <Box position="relative">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
            Ingredient List
          </Text>

          <Box position="relative">
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
              pr="40px"
            />
            <Button
              position="absolute"
              right="2"
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

          {showIngredientDropdown &&
            (ingredientSearch ? filteredIngredients : ingredients).length > 0 && (
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
                {(ingredientSearch ? filteredIngredients : ingredients).map((ingredient) => (
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
          {showIngredientDropdown && 
            !ingredientSearch &&
            (ingredientSearch ? filteredIngredients : ingredients).length === 0 && (
              <Box
                mt={2}
                bg="white"
                borderRadius="12px"
                border="1px solid"
                borderColor="#dbe5f4"
                boxShadow="md"
                px={4}
                py={3}
                position="absolute"
                w="100%"
                zIndex={20}
              >
                <Text fontSize="sm" color="gray.500">
                  No ingredients found
                </Text>
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

        <HStack justify="space-between" pt={2} flexWrap="wrap" gap={4} align="stretch">
          <Box flex="1" minW={{ base: "100%", md: "340px" }}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color={colors.darkest} mb={2}>
              Replace Image
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
                  Drag and drop a new food image here
                </Text>
                <Text fontSize="xs" color="gray.600">
                  or click to browse from your device
                </Text>
                {imageFile ? (
                  <Text fontSize="xs" color={colors.primary} fontWeight="600">
                    Selected: {imageFile.name}
                  </Text>
                ) : currentImageName ? (
                  <Text fontSize="xs" color="gray.600">
                    {currentImageName}
                  </Text>
                ) : null}
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
                type="button"
              >
                Remove Selected Image
              </Button>
            )}
          </Box>

          <Box
            minW={{ base: "100%", md: "280px" }}
            maxW={{ base: "100%", md: "320px" }}
            bg="#FFF5F5"
            border="1px solid"
            borderColor="#FED7D7"
            borderRadius="16px"
            px={4}
            py={4}
          >
            <Text fontSize="sm" fontWeight="700" color="red.700" mb={1}>
              Danger Zone
            </Text>
            <Text fontSize="xs" color="red.600" lineHeight="1.6" mb={3}>
              Permanently remove this food from the library and admin listing.
            </Text>
            <Button
              onClick={handleDelete}
              bg="white"
              color="red.600"
              borderRadius="full"
              px={{ base: 5, md: 6 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="700"
              border="1px solid"
              borderColor="#FEB2B2"
              _hover={{ bg: "red.50", borderColor: "#FC8181" }}
              leftIcon={<FiTrash2 />}
              w="100%"
              type="button"
            >
              Delete Food
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
