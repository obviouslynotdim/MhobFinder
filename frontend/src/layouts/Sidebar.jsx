import {
  Box,
  HStack,
  IconButton,
  Image,
  Spacer,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiHeart, FiHome, FiInfo, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useApp } from "../context/AppProvider.jsx";
import { colors } from "../theme/tokens.js";

// Import ingredient type images
import pantryImg from "../assets/type/cuisine.png";
import dairyImg from "../assets/type/dairy.png";
import meatsImg from "../assets/type/meats.png";
import vegetablesImg from "../assets/type/vegetables.png";
import seafoodImg from "../assets/type/seafood.png";
import fruitsImg from "../assets/type/fruits.png";
import spicesImg from "../assets/type/spices.png";
import saucesImg from "../assets/type/sauces.png";
import grainsImg from "../assets/type/grains.png";

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
      px="3"
      py="1"
      border="1px solid"
      borderColor={selected ? colors.primary : "transparent"}
      borderRadius="full"
      cursor="pointer"
      fontSize="sm"
      bg={selected ? colors.primary : chipBg(item.color)}
      color={selected ? "white" : colors.darkest}
      _hover={{
        transform: "translateY(-1px)",
        bg: selected ? colors.dark : colors.chipHover,
        color: selected ? "white" : colors.darkest,
      }}
      onClick={onClick}
      boxShadow="sm"
      userSelect="none"
    >
      {item.name}
    </Box>
  );
}

const CATEGORY_ORDER = [
  "Pantry Essentials",
  "Meats",
  "Vegetables & Greens",
  "Sauces & Condiments",
  "Noodles & Grains",
  "Seafood",
  "Fruits",
  "Dairy",
  "Spices & Heat",
];

function groupByCategory(ingredients) {
  const map = new Map();
  const allowed = new Set(CATEGORY_ORDER);

  // Mapping from ingredient type to category
  const typeToCategory = {
    Meat: "Meats",
    Seafood: "Seafood",
    Vegetable: "Vegetables & Greens",
    Herb: "Vegetables & Greens",
    Fruit: "Fruits",
    Grain: "Noodles & Grains",
    Dairy: "Dairy",
    Egg: "Meats",
    Spice: "Spices & Heat",
    Sauce: "Sauces & Condiments",
    Sweetener: "Pantry Essentials",
    Oil: "Pantry Essentials",
    "Flour & Starch": "Pantry Essentials",
  };

  for (const ing of ingredients) {
    const typeName = (ing.type?.name || "").trim();
    const cat = typeToCategory[typeName] || "Other";

    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(ing);
  }

  return map;
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
  const loc = useLocation();
  const [expandedCats, setExpandedCats] = useState(new Set());

  function toggleCat(cat) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  // Collapsed sidebar (icon rail)
  if (collapsed) {
    const navItems = [
      { to: "/", icon: <FiHome />, label: "Home" },
      { to: "/favorites", icon: <FiHeart />, label: "Favorites" },
      { to: "/profile", icon: <FiUser />, label: "Profile" },
      { to: "/about", icon: <FiInfo />, label: "About" },
    ];

    return (
      <VStack py="4" gap="3" align="center">
        {navItems.map((n) => (
          <IconButton
            key={n.to}
            as={Link}
            to={n.to}
            aria-label={n.label}
            title={n.label}
            variant="ghost"
            color="white"
            bg={loc.pathname === n.to ? "whiteAlpha.200" : "transparent"}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            {n.icon}
          </IconButton>
        ))}
      </VStack>
    );
  }

  // Expanded sidebar (grouped by categories)
  const grouped = groupByCategory(ingredients);

  return (
    <Box p="5" color={colors.darkest}>
      {CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) || [];
        if (list.length === 0) return null;

        const hasOverflow = list.length > CACHE_LIMIT;
        const isExpanded = expandedCats.has(cat);
        const visibleList = hasOverflow && !isExpanded ? list.slice(0, CACHE_LIMIT) : list;
        const hiddenCount = list.length - CACHE_LIMIT;

        const selectedCount = list.filter((x) =>
          selectedIds.includes(x.ingredient_id),
        ).length;

        return (
          <Box
            key={cat}
            mt="4"
            mb="7"
            borderRadius="2xl"
            p="5"
            bg="white"
            border="1px solid"
            borderColor={`${colors.primary}22`}
            boxShadow="0 8px 20px rgba(43,76,126,0.12)"
          >
            <HStack align="center" spacing="3" mb="5">
              {(() => {
                const img = getCategoryImage(cat);
                return img ? (
                  <Image
                    src={img}
                    alt={cat}
                    boxSize="50px"
                    objectFit="contain"
                    flexShrink={0}
                  />
                ) : null;
              })()}

              <VStack align="start" justify="center" spacing="1">
                <Text fontWeight="bold" color={colors.darkest} lineHeight="1">
                  {cat}
                </Text>
                <Text fontSize="xs" color={colors.dark} lineHeight="1">
                  {selectedCount}/{list.length} Ingredients
                </Text>
              </VStack>

              <Spacer />

              {hasOverflow && (
                <IconButton
                  aria-label={isExpanded ? "Show less" : "Show more"}
                  size="sm"
                  variant="ghost"
                  color={colors.dark}
                  onClick={() => toggleCat(cat)}
                >
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </IconButton>
              )}
            </HStack>

            <Box
              bg={colors.pageBg}
              border="1px solid"
              borderColor={`${colors.primary}26`}
              borderRadius="2xl"
              p="3"
            >
              <Wrap spacing="2" spacingY="2">
                {visibleList.map((item) => (
                  <WrapItem key={item.ingredient_id}>
                    <IngredientChip
                      item={item}
                      selected={selectedIds.includes(item.ingredient_id)}
                      onClick={() => toggleIngredient(item.ingredient_id)}
                    />
                  </WrapItem>
                ))}

                {hasOverflow && !isExpanded && (
                  <WrapItem>
                    <Box
                      px="3"
                      py="1"
                      borderRadius="full"
                      fontSize="sm"
                      bg="gray.200"
                      color={colors.dark}
                      cursor="pointer"
                      onClick={() => toggleCat(cat)}
                    >
                      +{hiddenCount} more
                    </Box>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          </Box>
        );
      })}

      {/* Optional: render uncategorized ingredients */}
      {(() => {
        const other = grouped.get("Other") || [];
        if (!other.length) return null;

        const selectedCount = other.filter((x) =>
          selectedIds.includes(x.ingredient_id),
        ).length;

        return (
          <Box
            mb="2"
            borderRadius="2xl"
            p="3"
            bg="white"
            border="1px solid"
            borderColor={`${colors.primary}22`}
            boxShadow="0 8px 20px rgba(43,76,126,0.12)"
          >
            <HStack align="start" spacing="3" mb="5">
              <VStack align="start" spacing="1">
                <Text fontWeight="bold" color={colors.darkest} lineHeight="0.9">
                  Other
                </Text>
                <Text fontSize="xs" color={colors.dark} lineHeight="0.9">
                  {selectedCount}/{other.length} Ingredients
                </Text>
              </VStack>
            </HStack>

            <Box
              bg={colors.pageBg}
              border="1px solid"
              borderColor={`${colors.primary}26`}
              borderRadius="2xl"
              p="3"
            >
              <Wrap spacing="2" spacingY="2">
                {other.map((item) => (
                  <WrapItem key={item.ingredient_id}>
                    <IngredientChip
                      item={item}
                      selected={selectedIds.includes(item.ingredient_id)}
                      onClick={() => toggleIngredient(item.ingredient_id)}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </Box>
        );
      })()}
    </Box>
  );
}
