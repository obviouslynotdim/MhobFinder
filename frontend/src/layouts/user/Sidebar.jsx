import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiHome,
  FiInfo,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { useApp } from "../../context/AppProvider.jsx";
import { useUser } from "../../context/UserProvider.jsx";
import { colors } from "../../theme/tokens.js";

// Import ingredient type images
import pantryImg from "../../assets/type/cuisine.png";
import dairyImg from "../../assets/type/dairy.png";
import meatsImg from "../../assets/type/meats.png";
import vegetablesImg from "../../assets/type/vegetables.png";
import seafoodImg from "../../assets/type/seafood.png";
import fruitsImg from "../../assets/type/fruits.png";
import spicesImg from "../../assets/type/spices.png";
import saucesImg from "../../assets/type/sauces.png";
import grainsImg from "../../assets/type/grains.png";
import backgroundImage from "../../assets/bg.png";

function chipBg(color) {
  // Muted palette to keep chips readable and consistent with the blue brand theme.
  const map = {
    orange: "orange.100",
    green: "green.100",
    blue: "blue.100",
    teal: "teal.100",
    red: "red.100",
    yellow: "yellow.100",
    gray: "gray.100",
    pink: "pink.100",
    purple: "purple.100",
    cyan: "cyan.100",
  };
  return map[color] || "gray.100";
}

function IngredientChip({ item, selected, onClick }) {
  return (
    <Box
      px={{ base: "2.5", md: "3" }}
      py={{ base: "0.75", md: "1" }}
      border="1.5px solid"
      borderColor={selected ? colors.primary : "transparent"}
      borderRadius="full"
      cursor="pointer"
      fontSize={{ base: "11px", md: "xs" }}
      fontWeight={selected ? "600" : "500"}
      bg={selected ? colors.primary : chipBg(item.color)}
      color={selected ? "white" : colors.darkest}
      _hover={{
        transform: "translateY(-1px)",
        bg: selected ? colors.dark : colors.chipHover,
        color: selected ? "white" : colors.darkest,
        boxShadow: "sm",
      }}
      transition="all 0.15s ease"
      onClick={onClick}
      boxShadow={selected ? "0 2px 6px rgba(73,117,187,0.35)" : "none"}
      userSelect="none"
    >
      {item.name}
    </Box>
  );
}

const CATEGORY_ORDER = [
  "Vegetables & Greens",
  "Pantry Essentials",
  "Meats",
  "Sauces & Condiments",
  "Noodles & Grains",
  "Seafood",
  "Fruits",
  "Dairy",
  "Spices & Heat",
];

function groupByCategory(ingredients) {
  const map = new Map();

  // Match EXACT database values (case-insensitive safe)
  const typeToCategory = {
    "meat & protein": "Meats",
    "vegetable & green": "Vegetables & Greens",
    "pantry essentials": "Pantry Essentials",
    "spices & herbs": "Spices & Heat",
  };

  for (const ing of ingredients) {
    // Safe access + normalize text
    const rawType = ing.type?.name || "";
    const typeName = rawType.toLowerCase().trim();

    // Map to UI category
    const cat = typeToCategory[typeName] || "Other";

    if (!map.has(cat)) {
      map.set(cat, []);
    }

    map.get(cat).push(ing);
  }

  return map;
}

// function groupByCategory(ingredients) {
//   const map = new Map();

//   // Mapping from ingredient type to category
//   const typeToCategory = {
//     Meat: "Meats",
//     Seafood: "Seafood",
//     Vegetable: "Vegetables & Greens",
//     Herb: "Vegetables & Greens",
//     Fruit: "Fruits",
//     Grain: "Noodles & Grains",
//     Dairy: "Dairy",
//     Egg: "Meats",
//     Spice: "Spices & Heat",
//     Sauce: "Sauces & Condiments",
//     Sweetener: "Pantry Essentials",
//     Oil: "Pantry Essentials",
//     "Flour & Starch": "Pantry Essentials",
//   };

//   for (const ing of ingredients) {
//     const typeName = (ing.type?.name || "").trim();
//     const cat = typeToCategory[typeName] || "Other";

//     if (!map.has(cat)) map.set(cat, []);
//     map.get(cat).push(ing);
//   }

//   return map;
// }

function RailItem({ item, isActive }) {
  return (
    <Box
      key={item.to}
      position="relative"
      w="100%"
      display="flex"
      justifyContent="center"
    >
      {isActive && (
        <Box
          position="absolute"
          left="-4"
          top="50%"
          transform="translateY(-50%)"
          h="22px"
          w="3px"
          bg="white"
          borderRadius="0 3px 3px 0"
        />
      )}
      <IconButton
        as={Link}
        to={item.to}
        aria-label={item.label}
        title={item.label}
        variant="ghost"
        color="white"
        fontSize="lg"
        bg={isActive ? "whiteAlpha.200" : "transparent"}
        _hover={{ bg: "whiteAlpha.200" }}
      >
        {item.icon}
      </IconButton>
    </Box>
  );
}

function getCategoryImage(category) {
  const imageMap = {
    Dairy: dairyImg,
    Meats: meatsImg,
    "Vegetables & Greens": vegetablesImg,
    "Pantry Essentials": pantryImg,
    Seafood: seafoodImg,
    Fruits: fruitsImg,
    "Spices & Heat": spicesImg,
    "Sauces & Condiments": saucesImg,
    "Noodles & Grains": grainsImg,
    // Add more images as they become available
  };
  return imageMap[category] || null;
}

const CACHE_LIMIT = 10;

export default function Sidebar({ collapsed }) {
  const { ingredients, selectedIds, toggleIngredient } = useApp();
  const { user } = useUser();
  const loc = useLocation();
  const navigate = useNavigate();
  const [expandedCats, setExpandedCats] = useState(new Set());

  function handleIngredientSelect(ingredientId) {
    toggleIngredient(ingredientId);
    if (loc.pathname === "/") {
      navigate("/home");
    }
  }

  function toggleCat(cat) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  // Collapsed sidebar (icon rail)
  if (collapsed) {
    const mainNavItems = [
      { to: "/home", icon: <FiHome />, label: "Home" },
      { to: "/profile", icon: <FiUser />, label: "Profile" },
    ];

    if (user) {
      mainNavItems.splice(1, 0, {
        to: "/favorites",
        icon: <FiHeart />,
        label: "Favorites",
      });
    }

    const aboutItem = { to: "/about", icon: <FiInfo />, label: "About" };

    return (
      <Box
        position="relative"
        h={{ base: "calc(100vh - 104px)", md: "calc(100vh - 120px)" }}
        px={{ base: "2", md: "4" }}
        bg="#4975BB"
      >
        <VStack
          w="full"
          gap="2"
          align="center"
          position="absolute"
          top="50%"
          left="0"
          transform="translateY(calc(-50% - 48px))"
        >
          {mainNavItems.map((item) => (
            <RailItem
              key={item.to}
              item={item}
              isActive={loc.pathname === item.to}
            />
          ))}
        </VStack>

        <Box position="absolute" left="0" right="0" bottom="16px" mb="8">
          <RailItem item={aboutItem} isActive={loc.pathname === aboutItem.to} />
        </Box>
      </Box>
    );
  }

  // Expanded sidebar (grouped by categories)
  const grouped = groupByCategory(ingredients);

  return (
    <Box
      px={{ base: "2", md: "4" }}
      py={{ base: "3", md: "5" }}
      color={colors.darkest}
      position="relative"
      bg="linear-gradient(180deg, #F8FAFF 0%, #EEF4FF 100%)"
    >
      <Box
        position="absolute"
        inset="0"
        bgImage={`url(${backgroundImage})`}
        bgRepeat="repeat"
        bgSize="320px"
        opacity={0.18}
        pointerEvents="none"
        zIndex={0}
      />
      <Box position="relative" zIndex={1}>
        {CATEGORY_ORDER.map((cat) => {
          const list = grouped.get(cat) || [];
          if (list.length === 0) return null;

          const hasOverflow = list.length > CACHE_LIMIT;
          const isExpanded = expandedCats.has(cat);
          const visibleList =
            hasOverflow && !isExpanded ? list.slice(0, CACHE_LIMIT) : list;
          const hiddenCount = list.length - CACHE_LIMIT;

          const selectedCount = list.filter((x) =>
            selectedIds.includes(x.ingredient_id),
          ).length;

          const img = getCategoryImage(cat);

          return (
            <Box
              key={cat}
              mb={{ base: "2.5", md: "4" }}
              borderRadius={{ base: "xl", md: "2xl" }}
              p={{ base: "2.5", md: "4" }}
              bg="white"
              border="1px solid"
              borderColor={
                selectedCount > 0 ? `${colors.primary}40` : `${colors.primary}18`
              }
              boxShadow={
                selectedCount > 0
                  ? "0 4px 14px rgba(73,117,187,0.14)"
                  : "0 2px 8px rgba(43,76,126,0.07)"
              }
              transition="box-shadow 0.2s, border-color 0.2s"
            >
              {/* Category header */}
              <HStack align="center" mb="3" gap={{ base: "2", md: "3" }}>
                {img && (
                  <Box
                    bg="#f5f5f5"
                    borderRadius="xl"
                    p={{ base: "1.5", md: "2" }}
                    flexShrink={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={{ base: "40px", md: "62px" }}
                  >
                    <Image
                      src={img}
                      alt={cat}
                      boxSize={{ base: "28px", md: "46px" }}
                      objectFit="contain"
                    />
                  </Box>
                )}

                <Box flex="1" minW="0">
                  <Text
                    fontWeight="700"
                    fontSize={{ base: "11px", md: "sm" }}
                    color={colors.darkest}
                    lineHeight="1.3"
                    whiteSpace="normal"
                    wordBreak="normal"
                    overflowWrap="normal"
                    noOfLines={2}
                  >
                    {cat}
                  </Text>
                  <Text
                    fontSize={{ base: "10px", md: "xs" }}
                    color={colors.dark}
                    lineHeight="1.3"
                    noOfLines={1}
                  >
                    {selectedCount}/{list.length} Ingredients
                  </Text>
                </Box>

                {hasOverflow && (
                  <IconButton
                    aria-label={isExpanded ? "Show less" : "Show more"}
                    size="xs"
                    variant="ghost"
                    color={colors.dark}
                    _hover={{ bg: colors.pageBg }}
                    onClick={() => toggleCat(cat)}
                  >
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </IconButton>
                )}
              </HStack>

              {/* Divider */}
              <Box h="1px" bg={`${colors.primary}18`} mb="3" />

              {/* Chips */}
              <Wrap spacing={{ base: "1", md: "1.5" }} spacingY={{ base: "1", md: "1.5" }}>
                {visibleList.map((item) => (
                  <WrapItem key={item.ingredient_id}>
                    <IngredientChip
                      item={item}
                      selected={selectedIds.includes(item.ingredient_id)}
                      onClick={() => handleIngredientSelect(item.ingredient_id)}
                    />
                  </WrapItem>
                ))}

                {hasOverflow && !isExpanded && (
                  <WrapItem>
                    <Box
                      px="3"
                      py="1"
                      borderRadius="full"
                      fontSize={{ base: "11px", md: "xs" }}
                      fontWeight="500"
                      border="1.5px dashed"
                      borderColor={colors.dark}
                      color={colors.dark}
                      cursor="pointer"
                      _hover={{ bg: colors.pageBg, borderStyle: "solid" }}
                      transition="all 0.15s ease"
                      onClick={() => toggleCat(cat)}
                    >
                      +{hiddenCount} more
                    </Box>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          );
        })}

        {/* Uncategorized ingredients */}
        {(() => {
          const other = grouped.get("Other") || [];
          if (!other.length) return null;

          const selectedCount = other.filter((x) =>
            selectedIds.includes(x.ingredient_id),
          ).length;

          return (
            <Box
              mb={{ base: "2.5", md: "4" }}
              borderRadius={{ base: "xl", md: "2xl" }}
              p={{ base: "2.5", md: "4" }}
              bg="white"
              border="1px solid"
              borderColor={
                selectedCount > 0 ? `${colors.primary}40` : `${colors.primary}18`
              }
              boxShadow="0 2px 8px rgba(43,76,126,0.07)"
            >
              <HStack align="center" mb="3" gap="3">
                <Box flex="1" minW="0">
                  <Text
                    fontWeight="700"
                    fontSize={{ base: "xs", md: "sm" }}
                    color={colors.darkest}
                    lineHeight="1.3"
                  >
                    Other
                  </Text>
                  <Text
                    fontSize={{ base: "10px", md: "xs" }}
                    color={colors.dark}
                    lineHeight="1.3"
                    noOfLines={1}
                  >
                    {selectedCount}/{other.length} Ingredients
                  </Text>
                </Box>
              </HStack>
              <Box h="1px" bg={`${colors.primary}18`} mb="3" />
              <Wrap spacing={{ base: "1", md: "1.5" }} spacingY={{ base: "1", md: "1.5" }}>
                {other.map((item) => (
                  <WrapItem key={item.ingredient_id}>
                    <IngredientChip
                      item={item}
                      selected={selectedIds.includes(item.ingredient_id)}
                      onClick={() => handleIngredientSelect(item.ingredient_id)}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
}
