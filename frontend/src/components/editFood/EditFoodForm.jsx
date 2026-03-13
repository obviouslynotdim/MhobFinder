import { useMemo, useState, useEffect } from "react";
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
import {
  getFoodById,
  updateFood,
  deleteFood,
} from "../../services/api/food.service";
import { getAllCategories } from "../../services/api/category.service";
import { getAllIngredients } from "../../services/api/ingredient.service";

export default function EditFoodForm({ foodId }) {
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState("Published");
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
    Promise.all([
      getFoodById(foodId),
      getAllCategories(),
      getAllIngredients(),
    ])
      .then(([foodData, categoryData, ingredientData]) => {
        setFood(foodData);
        setTitle(foodData.title);
        setDescription(foodData.description);
        setLinkUrl(foodData.link_url);
        setStatus(foodData.status || "Published");
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
            sel === name
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
          (item.name || item.ingredient_name) !== (ingredient.name || ingredient.ingredient_name)
      )
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
      await updateFood(foodId, {
        title,
        description,
        ingredientIds: selectedIngredients.map((i) => i.ingredient_id || i),
        categoryIds: selectedCategory
          ? [selectedCategory.category_id || selectedCategory]
          : [],
        link_url: linkUrl,
        imageFile,
        status,
      });
      alert("Food updated successfully!");
      navigate("/admin/foods");
    } catch (err) {
      setError("Failed to update food.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?",
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      await deleteFood(foodId);
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
      border="2px solid"
      borderColor="gray.300"
      bg="#c8d4ea"
      maxH="80vh"
      overflowY="auto"
    >
      <Box bg="#4f79bd" px={6} py={5} position="sticky" top={0} zIndex={10}>
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="white">
            Edit Food
          </Heading>
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
            leftIcon={<FiSave />}
          >
            Save Changes
          </Button>
        </HStack>
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
            <Box mt={2} px={4} py={2} bg="#e3eafc" borderRadius="md" display="inline-block">
              <Text fontSize="md" color="#4f79bd">
                {selectedCategory.name || selectedCategory.category_name || selectedCategory}
              </Text>
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
                    key={ingredient.ingredient_id || ingredient.id || ingredient.name}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onMouseDown={() => handleAddIngredient(ingredient)}
                  >
                    {ingredient.name || ingredient.ingredient_name || ingredient}
                  </Box>
                ))}
              </Box>
            )}

          {selectedIngredients.length > 0 && (
            <>
              <Wrap mt={4} spacing={3}>
                {selectedIngredients.map((ingredient) => (
                  <WrapItem key={ingredient.ingredient_id || ingredient.id || ingredient.name}>
                    <HStack
                      bg="#4f79bd"
                      color="white"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      <Text fontSize="sm">{ingredient.name || ingredient.ingredient_name || ingredient}</Text>
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
            leftIcon={<FiTrash2 />}
          >
            Delete
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
