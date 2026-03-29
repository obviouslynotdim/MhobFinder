import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiRefreshCcw,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { colors } from "../../theme/tokens.js";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";
import { useAdminAlert } from "../../context/AdminAlertContext.jsx";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
} from "../../services/api/ingredient.service.js";
import {
  createIngredientType,
  deleteIngredientType,
  getAllIngredientTypes,
  updateIngredientType,
} from "../../services/api/ingredientType.service.js";

const ADMIN_INGREDIENTS_CACHE_KEY = "mhob:admin-ingredients:v1";
const ADMIN_INGREDIENTS_CACHE_TTL_MS = 15 * 60 * 1000;
const INGREDIENT_TYPES_BATCH_SIZE = 20;
const INGREDIENTS_BATCH_SIZE = 15;

const parseApiError = (error, fallback) => {
  const message = String(error?.message || "").trim();
  if (!message) return fallback;

  const payloadCandidate = message.includes(":")
    ? message.slice(message.indexOf(":") + 1).trim()
    : "";

  if (payloadCandidate.startsWith("{") && payloadCandidate.endsWith("}")) {
    try {
      const parsed = JSON.parse(payloadCandidate);
      return parsed?.message || parsed?.error || fallback;
    } catch {
      return message;
    }
  }

  return message;
};

const readAdminIngredientsCache = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_INGREDIENTS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const isExpired =
      !parsed?.timestamp ||
      Date.now() - parsed.timestamp > ADMIN_INGREDIENTS_CACHE_TTL_MS;

    if (isExpired) {
      window.localStorage.removeItem(ADMIN_INGREDIENTS_CACHE_KEY);
      return null;
    }

    if (!Array.isArray(parsed.types) || !Array.isArray(parsed.ingredients)) {
      return null;
    }

    return {
      types: parsed.types,
      ingredients: parsed.ingredients,
    };
  } catch {
    return null;
  }
};

const writeAdminIngredientsCache = (types, ingredients) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      ADMIN_INGREDIENTS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        types,
        ingredients,
      }),
    );
  } catch {
    // Ignore storage failures to keep page behavior stable.
  }
};

export default function AdminIngredients() {
  const { showAlert, confirm } = useAdminAlert();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ingredientTypes, setIngredientTypes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [ingredientTypesSearch, setIngredientTypesSearch] = useState("");
  const [ingredientsTypeFilter, setIngredientsTypeFilter] = useState("all");
  const [visibleTypeCount, setVisibleTypeCount] = useState(INGREDIENT_TYPES_BATCH_SIZE);
  const [visibleIngredientCount, setVisibleIngredientCount] = useState(INGREDIENTS_BATCH_SIZE);

  const [newTypeName, setNewTypeName] = useState("");
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientTypeId, setNewIngredientTypeId] = useState("");

  const [editingTypeById, setEditingTypeById] = useState({});
  const [editingIngredientById, setEditingIngredientById] = useState({});

  const [busyTypeId, setBusyTypeId] = useState(null);
  const [busyIngredientId, setBusyIngredientId] = useState(null);
  const [creatingType, setCreatingType] = useState(false);
  const [creatingIngredient, setCreatingIngredient] = useState(false);

  const applyDataToState = (typesData, ingredientsData) => {
    const safeTypes = Array.isArray(typesData) ? typesData : [];
    const safeIngredients = Array.isArray(ingredientsData) ? ingredientsData : [];

    setIngredientTypes(safeTypes);
    setIngredients(safeIngredients);

    setEditingTypeById(
      safeTypes.reduce((acc, type) => {
        acc[type.type_id] = type.name || "";
        return acc;
      }, {}),
    );

    setEditingIngredientById(
      safeIngredients.reduce((acc, ingredient) => {
        acc[ingredient.ingredient_id] = {
          name: ingredient.name || "",
          type_id: String(ingredient.type_id || ""),
        };
        return acc;
      }, {}),
    );

    setNewIngredientTypeId((prev) => {
      if (prev && safeTypes.some((type) => String(type.type_id) === prev)) {
        return prev;
      }
      return safeTypes.length > 0 ? String(safeTypes[0].type_id) : "";
    });
  };

  const loadData = async ({ forceRefresh = false } = {}) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    let usedCachedData = false;
    if (!forceRefresh) {
      const cached = readAdminIngredientsCache();
      if (cached) {
        usedCachedData = true;
        applyDataToState(cached.types, cached.ingredients);
        setLoading(false);
      }
    }

    try {
      const [types, ingredientsData] = await Promise.all([
        getAllIngredientTypes({ forceRefresh }),
        getAllIngredients({ forceRefresh }),
      ]);

      applyDataToState(types, ingredientsData);
      writeAdminIngredientsCache(
        Array.isArray(types) ? types : [],
        Array.isArray(ingredientsData) ? ingredientsData : [],
      );
    } catch (error) {
      if (usedCachedData) {
        showAlert({
          tone: "warning",
          title: "Using Cached Data",
          description: "Live refresh failed, showing recent cached ingredients.",
        });
      } else {
        showAlert({
          tone: "error",
          title: "Load Failed",
          description: parseApiError(error, "Could not load ingredients data."),
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    writeAdminIngredientsCache(ingredientTypes, ingredients);
  }, [ingredientTypes, ingredients, loading]);

  const ingredientCountByTypeId = useMemo(() => {
    return ingredients.reduce((map, ingredient) => {
      const key = ingredient.type_id;
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const sorted = [...ingredients].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || "")),
    );

    if (ingredientsTypeFilter === "all") {
      return sorted;
    }

    const selectedTypeId = Number.parseInt(ingredientsTypeFilter, 10);
    if (!Number.isInteger(selectedTypeId) || selectedTypeId <= 0) {
      return sorted;
    }

    return sorted.filter(
      (ingredient) => Number(ingredient.type_id) === selectedTypeId,
    );
  }, [ingredients, ingredientsTypeFilter]);

  const filteredIngredientTypes = useMemo(() => {
    const query = ingredientTypesSearch.trim().toLowerCase();
    const sorted = [...ingredientTypes].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || "")),
    );

    if (!query) return sorted;

    return sorted.filter((type) =>
      String(type.name || "").toLowerCase().includes(query),
    );
  }, [ingredientTypes, ingredientTypesSearch]);

  const visibleIngredientTypes = useMemo(
    () => filteredIngredientTypes.slice(0, visibleTypeCount),
    [filteredIngredientTypes, visibleTypeCount],
  );

  const hasMoreIngredientTypes = visibleTypeCount < filteredIngredientTypes.length;

  const visibleIngredients = useMemo(
    () => filteredIngredients.slice(0, visibleIngredientCount),
    [filteredIngredients, visibleIngredientCount],
  );

  const hasMoreIngredients = visibleIngredientCount < filteredIngredients.length;

  useEffect(() => {
    setVisibleTypeCount(INGREDIENT_TYPES_BATCH_SIZE);
  }, [ingredientTypesSearch, ingredientTypes.length]);

  useEffect(() => {
    setVisibleIngredientCount(INGREDIENTS_BATCH_SIZE);
  }, [ingredientsTypeFilter, ingredients.length]);

  const handleCreateType = async () => {
    const name = newTypeName.trim();
    if (!name) {
      showAlert({
        tone: "warning",
        title: "Type Name Required",
        description: "Please enter an ingredient type name.",
      });
      return;
    }

    setCreatingType(true);
    try {
      const created = await createIngredientType({ name });
      setIngredientTypes((prev) => {
        const next = [...prev, created].sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || "")),
        );
        return next;
      });
      setEditingTypeById((prev) => ({ ...prev, [created.type_id]: created.name || "" }));
      setNewTypeName("");
      if (!newIngredientTypeId) {
        setNewIngredientTypeId(String(created.type_id));
      }

      showAlert({
        tone: "success",
        title: "Type Added",
        description: "Ingredient type created successfully.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Create Failed",
        description: parseApiError(error, "Could not create ingredient type."),
      });
    } finally {
      setCreatingType(false);
    }
  };

  const handleUpdateType = async (typeId) => {
    const draftName = String(editingTypeById[typeId] || "").trim();
    if (!draftName) {
      showAlert({
        tone: "warning",
        title: "Type Name Required",
        description: "Ingredient type name cannot be empty.",
      });
      return;
    }

    setBusyTypeId(typeId);
    try {
      const updated = await updateIngredientType(typeId, { name: draftName });
      setIngredientTypes((prev) =>
        prev.map((type) => (type.type_id === typeId ? updated : type)),
      );
      setIngredients((prev) =>
        prev.map((ingredient) => {
          if (ingredient.type_id !== typeId) return ingredient;
          return {
            ...ingredient,
            type: {
              ...(ingredient.type || {}),
              type_id: updated.type_id,
              name: updated.name,
            },
          };
        }),
      );

      showAlert({
        tone: "success",
        title: "Type Updated",
        description: "Ingredient type name updated.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Update Failed",
        description: parseApiError(error, "Could not update ingredient type."),
      });
    } finally {
      setBusyTypeId(null);
    }
  };

  const handleDeleteType = async (type) => {
    const confirmed = await confirm({
      tone: "error",
      title: "Delete This Type?",
      description: "Delete only works if there are no ingredients linked to this type.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (!confirmed) return;

    setBusyTypeId(type.type_id);
    try {
      await deleteIngredientType(type.type_id);
      setIngredientTypes((prev) => prev.filter((item) => item.type_id !== type.type_id));
      setEditingTypeById((prev) => {
        const next = { ...prev };
        delete next[type.type_id];
        return next;
      });

      setNewIngredientTypeId((prev) => {
        if (prev !== String(type.type_id)) return prev;
        const fallback = ingredientTypes.find((item) => item.type_id !== type.type_id);
        return fallback ? String(fallback.type_id) : "";
      });

      showAlert({
        tone: "success",
        title: "Type Deleted",
        description: "Ingredient type removed successfully.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Delete Failed",
        description: parseApiError(error, "Could not delete ingredient type."),
      });
    } finally {
      setBusyTypeId(null);
    }
  };

  const handleCreateIngredient = async () => {
    const name = newIngredientName.trim();
    const typeId = Number.parseInt(newIngredientTypeId, 10);

    if (!name || !Number.isInteger(typeId) || typeId <= 0) {
      showAlert({
        tone: "warning",
        title: "Incomplete Ingredient",
        description: "Please enter ingredient name and select a valid type.",
      });
      return;
    }

    setCreatingIngredient(true);
    try {
      const created = await createIngredient({
        name,
        type_id: typeId,
      });

      setIngredients((prev) => {
        const next = [...prev, created].sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || "")),
        );
        return next;
      });
      setEditingIngredientById((prev) => ({
        ...prev,
        [created.ingredient_id]: {
          name: created.name || "",
          type_id: String(created.type_id || ""),
        },
      }));
      setNewIngredientName("");

      showAlert({
        tone: "success",
        title: "Ingredient Added",
        description: "Ingredient created successfully.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Create Failed",
        description: parseApiError(error, "Could not create ingredient."),
      });
    } finally {
      setCreatingIngredient(false);
    }
  };

  const handleUpdateIngredient = async (ingredientId) => {
    const draft = editingIngredientById[ingredientId] || {};
    const name = String(draft.name || "").trim();
    const typeId = Number.parseInt(draft.type_id, 10);

    if (!name || !Number.isInteger(typeId) || typeId <= 0) {
      showAlert({
        tone: "warning",
        title: "Invalid Ingredient",
        description: "Ingredient name and type are required.",
      });
      return;
    }

    setBusyIngredientId(ingredientId);
    try {
      const updated = await updateIngredient(ingredientId, {
        name,
        type_id: typeId,
      });
      setIngredients((prev) =>
        prev.map((ingredient) =>
          ingredient.ingredient_id === ingredientId ? updated : ingredient,
        ),
      );

      showAlert({
        tone: "success",
        title: "Ingredient Updated",
        description: "Ingredient updated successfully.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Update Failed",
        description: parseApiError(error, "Could not update ingredient."),
      });
    } finally {
      setBusyIngredientId(null);
    }
  };

  const handleDeleteIngredient = async (ingredient) => {
    const confirmed = await confirm({
      tone: "error",
      title: "Delete This Ingredient?",
      description: "This ingredient will be removed if no recipes depend on it.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (!confirmed) return;

    setBusyIngredientId(ingredient.ingredient_id);
    try {
      await deleteIngredient(ingredient.ingredient_id);
      setIngredients((prev) =>
        prev.filter((item) => item.ingredient_id !== ingredient.ingredient_id),
      );
      setEditingIngredientById((prev) => {
        const next = { ...prev };
        delete next[ingredient.ingredient_id];
        return next;
      });

      showAlert({
        tone: "success",
        title: "Ingredient Deleted",
        description: "Ingredient removed successfully.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Delete Failed",
        description: parseApiError(error, "Could not delete ingredient."),
      });
    } finally {
      setBusyIngredientId(null);
    }
  };

  const totalIngredients = ingredients.length;
  const totalTypes = ingredientTypes.length;

  if (loading) {
    return (
      <AppLoadingState
        title="Loading ingredients"
        description="Preparing ingredient and type management."
        minH="320px"
      />
    );
  }

  return (
    <Box h="100%" minH={0} overflow="auto" overflowX="hidden" pr={1}>
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 6 }}
        minH="100%"
      >
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={4}
          direction={{ base: "column", md: "row" }}
          mb={5}
        >
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
              Ingredient Management
            </Text>
            <Text color="gray.600" mt={1}>
              Create and organize ingredient types and ingredient records.
            </Text>
          </Box>
          <Button
            leftIcon={<FiRefreshCcw />}
            onClick={() => loadData({ forceRefresh: true })}
            bg={colors.primary}
            color="white"
            _hover={{ bg: colors.dark }}
            borderRadius="full"
            loading={refreshing}
            whiteSpace="nowrap"
          >
            Refresh
          </Button>
        </Flex>

        <HStack mb={5} spacing={2} flexWrap="wrap" gap={3}>
          <Badge bg="#edf4ff" color={colors.darkest} px={3} py={1.5} borderRadius="full" fontSize="xs">
            Total Types: {totalTypes}
          </Badge>
          <Badge
            bg="#f8fbff"
            color={colors.darkest}
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="#dbe5f4"
            fontSize="xs"
          >
            Total Ingredients: {totalIngredients}
          </Badge>
          <Badge
            bg="#f8fbff"
            color={colors.darkest}
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="#dbe5f4"
            fontSize="xs"
          >
            Cache: localStorage (15m)
          </Badge>
        </HStack>

      {/* Ingredient Types Section */}
      <Box
        bg="#fbfdff"
        border="1px solid"
        borderColor="#dbe5f4"
        borderRadius="18px"
        mb={5}
        p={{ base: 4, md: 5 }}
      >
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" color={colors.darkest} mb={1}>
          Ingredient Types
        </Text>
        <Text color="gray.600" mb={4}>
          Showing {filteredIngredientTypes.length} type records.
        </Text>

        <Box>
          {/* Search and Add Form */}
          <VStack align="stretch" gap={4} mb={6}>
            <Flex
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              gap={3}
              direction={{ base: "column", md: "row" }}
            >
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Search ingredient types by name
              </Text>
              <Box position="relative" w={{ base: "100%", md: "320px" }}>
                <Input
                  value={ingredientTypesSearch}
                  onChange={(event) => setIngredientTypesSearch(event.target.value)}
                  placeholder="Search ingredient types"
                  bg="white"
                  border="1px solid"
                  borderColor="#dbe5f4"
                  borderRadius="10px"
                  h="40px"
                  px={3}
                  pr={ingredientTypesSearch ? "38px" : "12px"}
                  fontSize="sm"
                />
                {ingredientTypesSearch && (
                  <Box position="absolute" right="6px" top="50%" transform="translateY(-50%)">
                    <IconButton
                      aria-label="Clear search"
                      size="xs"
                      bg="transparent"
                      color="gray.400"
                      _hover={{ color: "gray.600" }}
                      borderRadius="full"
                      onClick={() => setIngredientTypesSearch("")}
                    >
                      <FiX size={16} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Flex>

            <Box bg="#f8fbff" border="1px solid" borderColor="#e5edfa" borderRadius="12px" p={{ base: 3, md: 4 }}>
              <Text fontSize="xs" fontWeight="700" letterSpacing="0.04em" color="gray.600" mb={2} textTransform="uppercase">
                Add Ingredient Type
              </Text>
              <Flex gap={2.5} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}>
                <Box flex={1} w="100%" position="relative">
                  <Input
                    value={newTypeName}
                    onChange={(event) => setNewTypeName(event.target.value)}
                    placeholder="Type name"
                    bg="white"
                    border="1px solid"
                    borderColor="#dbe5f4"
                    borderRadius="10px"
                    h="40px"
                    px={3}
                    pr={newTypeName ? "38px" : "12px"}
                    fontSize="sm"
                  />
                  {newTypeName && (
                    <Box position="absolute" right="6px" top="50%" transform="translateY(-50%)">
                      <IconButton
                        aria-label="Clear ingredient type input"
                        size="xs"
                        bg="transparent"
                        color="gray.400"
                        _hover={{ color: "gray.600" }}
                        borderRadius="full"
                        onClick={() => setNewTypeName("")}
                      >
                        <FiX size={16} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Button
                  leftIcon={<FiPlus />}
                  bg={colors.primary}
                  color="white"
                  borderRadius="10px"
                  _hover={{ bg: colors.dark }}
                  onClick={handleCreateType}
                  loading={creatingType}
                  h="40px"
                  px={5}
                  fontSize="sm"
                  whiteSpace="nowrap"
                  w={{ base: "100%", md: "auto" }}
                >
                  Add Type
                </Button>
              </Flex>
            </Box>
          </VStack>

          {/* Types List */}
          {ingredientTypes.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No ingredient types available.
            </Text>
          ) : filteredIngredientTypes.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No match found.
            </Text>
          ) : (
            <VStack align="stretch" gap={2}>
              {visibleIngredientTypes.map((type) => {
                const rowNumber = filteredIngredientTypes.indexOf(type) + 1;
                return (
                  <Flex
                    key={type.type_id}
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                    align={{ base: "stretch", md: "center" }}
                    p={3}
                    bg="#f9fafc"
                    border="1px solid"
                    borderColor="#e5edfa"
                    borderRadius="10px"
                    _hover={{ bg: "#fbfdff" }}
                  >
                    <Text fontWeight="600" color={colors.darkest} minW="24px" fontSize="sm">
                      {rowNumber}
                    </Text>
                    <Input
                      value={editingTypeById[type.type_id] ?? type.name ?? ""}
                      onChange={(event) =>
                        setEditingTypeById((prev) => ({
                          ...prev,
                          [type.type_id]: event.target.value,
                        }))
                      }
                      bg="white"
                      border="1px solid"
                      borderColor="#dbe5f4"
                      borderRadius="8px"
                      h="36px"
                      px={2}
                      flex={1}
                      minW={{ base: "100%", md: "200px" }}
                      fontSize="sm"
                    />
                    <Badge
                      alignSelf={{ base: "flex-start", md: "center" }}
                      bg="#eef4ff"
                      color={colors.darkest}
                      px={2}
                      py={1}
                      borderRadius="6px"
                      fontSize="xs"
                      minW="fit-content"
                    >
                      {ingredientCountByTypeId[type.type_id] || 0} items
                    </Badge>
                    <HStack gap={2} ml={{ base: 0, md: "auto" }} alignSelf={{ base: "flex-start", md: "center" }}>
                      <Button
                        size="xs"
                        leftIcon={<FiCheck size={14} />}
                        bg="#dbeafe"
                        color="#1e3a8a"
                        _hover={{ bg: "#bfdbfe" }}
                        onClick={() => handleUpdateType(type.type_id)}
                        loading={busyTypeId === type.type_id}
                        borderRadius="8px"
                      >
                        Save
                      </Button>
                      <IconButton
                        aria-label="Delete type"
                        size="xs"
                        bg="red.50"
                        color="red.600"
                        borderRadius="8px"
                        _hover={{ bg: "red.100" }}
                        onClick={() => handleDeleteType(type)}
                        isLoading={busyTypeId === type.type_id}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </HStack>
                  </Flex>
                );
              })}

              {hasMoreIngredientTypes && (
                <Flex justify="center" pt={2}>
                  <Button
                    size="sm"
                    bg="#edf4ff"
                    color={colors.darkest}
                    borderRadius="full"
                    _hover={{ bg: colors.chipHover }}
                    rightIcon={<FiChevronDown size={14} />}
                    onClick={() =>
                      setVisibleTypeCount((prev) => prev + INGREDIENT_TYPES_BATCH_SIZE)
                    }
                  >
                    See More
                  </Button>
                </Flex>
              )}
            </VStack>
          )}
        </Box>
      </Box>

      {/* Ingredients Section */}
      <Box
        bg="#fbfdff"
        border="1px solid"
        borderColor="#dbe5f4"
        borderRadius="18px"
        mb={{ base: 4, md: 6 }}
        p={{ base: 4, md: 5 }}
      >
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" color={colors.darkest} mb={1}>
          Ingredients
        </Text>
        <Text color="gray.600" mb={4}>
          Showing {filteredIngredients.length} ingredient records.
        </Text>

        <Box>
          {/* Filter and Add Form */}
          <VStack align="stretch" gap={4} mb={6}>
            <Flex
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              gap={3}
              direction={{ base: "column", md: "row" }}
            >
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Filter ingredients by type
              </Text>
              <Box position="relative" w={{ base: "100%", md: "320px" }}>
                <Box
                  as="select"
                  value={ingredientsTypeFilter}
                  onChange={(event) => setIngredientsTypeFilter(event.target.value)}
                  bg="white"
                  border="1px solid"
                  borderColor="#dbe5f4"
                  borderRadius="10px"
                  h="40px"
                  px={3}
                  pr={ingredientsTypeFilter !== "all" ? "38px" : "12px"}
                  fontSize="sm"
                  w="100%"
                >
                  <option value="all">All Ingredients</option>
                  {ingredientTypes
                    .slice()
                    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
                    .map((type) => (
                      <option key={type.type_id} value={String(type.type_id)}>
                        {type.name}
                      </option>
                    ))}
                </Box>
                {ingredientsTypeFilter !== "all" && (
                  <Box position="absolute" right="6px" top="50%" transform="translateY(-50%)">
                    <IconButton
                      aria-label="Clear filter"
                      size="xs"
                      bg="transparent"
                      color="gray.400"
                      _hover={{ color: "gray.600" }}
                      borderRadius="full"
                      onClick={() => setIngredientsTypeFilter("all")}
                    >
                      <FiX size={16} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Flex>

            <Box bg="#f8fbff" border="1px solid" borderColor="#e5edfa" borderRadius="12px" p={{ base: 3, md: 4 }}>
              <Text fontSize="xs" fontWeight="700" letterSpacing="0.04em" color="gray.600" mb={2} textTransform="uppercase">
                Add Ingredient
              </Text>
              <Flex gap={2.5} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}>
                <Box flex={1} w="100%">
                  <Box position="relative">
                    <Input
                      value={newIngredientName}
                      onChange={(event) => setNewIngredientName(event.target.value)}
                      placeholder="Ingredient name"
                      bg="white"
                      border="1px solid"
                      borderColor="#dbe5f4"
                      borderRadius="10px"
                      h="40px"
                      px={3}
                      pr={newIngredientName ? "38px" : "12px"}
                      fontSize="sm"
                    />
                    {newIngredientName && (
                      <Box position="absolute" right="6px" top="50%" transform="translateY(-50%)">
                        <IconButton
                          aria-label="Clear ingredient input"
                          size="xs"
                          bg="transparent"
                          color="gray.400"
                          _hover={{ color: "gray.600" }}
                          borderRadius="full"
                          onClick={() => setNewIngredientName("")}
                        >
                          <FiX size={16} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box w={{ base: "100%", md: "240px" }}>
                  <Box
                    as="select"
                    value={newIngredientTypeId}
                    onChange={(event) => setNewIngredientTypeId(event.target.value)}
                    bg="white"
                    border="1px solid"
                    borderColor="#dbe5f4"
                    borderRadius="10px"
                    h="40px"
                    px={3}
                    fontSize="sm"
                    w="100%"
                  >
                    {ingredientTypes.length === 0 && (
                      <option value="">No type available</option>
                    )}
                    {ingredientTypes
                      .slice()
                      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
                      .map((type) => (
                        <option key={type.type_id} value={type.type_id}>
                          {type.name}
                        </option>
                      ))}
                  </Box>
                </Box>
                <Button
                  leftIcon={<FiPlus />}
                  bg={colors.primary}
                  color="white"
                  borderRadius="10px"
                  _hover={{ bg: colors.dark }}
                  onClick={handleCreateIngredient}
                  loading={creatingIngredient}
                  h="40px"
                  px={5}
                  fontSize="sm"
                  isDisabled={ingredientTypes.length === 0}
                  whiteSpace="nowrap"
                  w={{ base: "100%", md: "auto" }}
                >
                  Add Ingredient
                </Button>
              </Flex>
            </Box>
          </VStack>

          {/* Ingredients List */}
          {filteredIngredients.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No ingredients found.
            </Text>
          ) : (
            <VStack align="stretch" gap={2}>
              {visibleIngredients.map((ingredient) => {
                const rowNumber = filteredIngredients.indexOf(ingredient) + 1;
                const draft = editingIngredientById[ingredient.ingredient_id] || {
                  name: ingredient.name || "",
                  type_id: String(ingredient.type_id || ""),
                };

                return (
                  <Flex
                    key={ingredient.ingredient_id}
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                    align={{ base: "stretch", md: "center" }}
                    p={3}
                    bg="#f9fafc"
                    border="1px solid"
                    borderColor="#e5edfa"
                    borderRadius="10px"
                    _hover={{ bg: "#fbfdff" }}
                  >
                    <Text fontWeight="600" color={colors.darkest} minW="24px" fontSize="sm">
                      {rowNumber}
                    </Text>
                    <Input
                      value={draft.name}
                      onChange={(event) =>
                        setEditingIngredientById((prev) => ({
                          ...prev,
                          [ingredient.ingredient_id]: {
                            ...draft,
                            name: event.target.value,
                          },
                        }))
                      }
                      bg="white"
                      border="1px solid"
                      borderColor="#dbe5f4"
                      borderRadius="8px"
                      h="36px"
                      px={2}
                      flex={1}
                      minW={{ base: "100%", md: "180px" }}
                      fontSize="sm"
                    />
                    <Box
                      as="select"
                      value={draft.type_id}
                      onChange={(event) =>
                        setEditingIngredientById((prev) => ({
                          ...prev,
                          [ingredient.ingredient_id]: {
                            ...draft,
                            type_id: event.target.value,
                          },
                        }))
                      }
                      bg="white"
                      border="1px solid"
                      borderColor="#dbe5f4"
                      borderRadius="8px"
                      h="36px"
                      px={2}
                      minW={{ base: "100%", md: "140px" }}
                      fontSize="sm"
                    >
                      {ingredientTypes.map((type) => (
                        <option key={type.type_id} value={type.type_id}>
                          {type.name}
                        </option>
                      ))}
                    </Box>
                    <HStack gap={2} ml={{ base: 0, md: "auto" }} alignSelf={{ base: "flex-start", md: "center" }}>
                      <Button
                        size="xs"
                        leftIcon={<FiCheck size={14} />}
                        bg="#dbeafe"
                        color="#1e3a8a"
                        _hover={{ bg: "#bfdbfe" }}
                        onClick={() => handleUpdateIngredient(ingredient.ingredient_id)}
                        loading={busyIngredientId === ingredient.ingredient_id}
                        borderRadius="8px"
                      >
                        Save
                      </Button>
                      <IconButton
                        aria-label="Delete ingredient"
                        size="xs"
                        bg="red.50"
                        color="red.600"
                        borderRadius="8px"
                        _hover={{ bg: "red.100" }}
                        onClick={() => handleDeleteIngredient(ingredient)}
                        isLoading={busyIngredientId === ingredient.ingredient_id}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </HStack>
                  </Flex>
                );
              })}

              {hasMoreIngredients && (
                <Flex justify="center" pt={2}>
                  <Button
                    size="sm"
                    bg="#edf4ff"
                    color={colors.darkest}
                    borderRadius="full"
                    _hover={{ bg: colors.chipHover }}
                    rightIcon={<FiChevronDown size={14} />}
                    onClick={() =>
                      setVisibleIngredientCount((prev) => prev + INGREDIENTS_BATCH_SIZE)
                    }
                  >
                    See More
                  </Button>
                </Flex>
              )}
            </VStack>
          )}
        </Box>
      </Box>

      </Box>
    </Box>
  );
}
