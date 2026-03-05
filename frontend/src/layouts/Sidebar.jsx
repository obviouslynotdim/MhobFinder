import {
  Box,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { Link, useLocation } from "react-router-dom";
import { FiHeart, FiHome, FiInfo } from "react-icons/fi";
import { useApp } from "../context/AppProvider.jsx";

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
  // small mapping so your dummyIngredient colors look nice on the brown sidebar
  const map = {
    orange: "orange.300",
    green: "green.300",
    blue: "blue.300",
    teal: "teal.300",
    red: "red.300",
    yellow: "yellow.300",
    gray: "gray.200",
    pink: "pink.200",
    purple: "purple.200",
    cyan: "cyan.200",
  };
  return map[color] || "whiteAlpha.900";
}

function IngredientChip({ item, selected, onClick }) {
  return (
    <Box
      px="3"
      py="1"
      borderRadius="full"
      cursor="pointer"
      fontSize="sm"
      bg={selected ? "blue.700" : chipBg(item.color)}
      color={selected ? "white" : "gray.900"}
      _hover={{ transform: "translateY(-1px)", opacity: 0.95 }}
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

export default function Sidebar({ collapsed }) {
  const { ingredients, selectedIds, toggleIngredient } = useApp();
  const loc = useLocation();

  // Collapsed sidebar (icon rail)
  if (collapsed) {
    const navItems = [
      { to: "/", icon: <FiHome />, label: "Home" },
      { to: "/favorites", icon: <FiHeart />, label: "Favorites" },
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
    <Box p="4" color="white">
      {CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) || [];
        if (list.length === 0) return null;

        const selectedCount = list.filter((x) =>
          selectedIds.includes(x.ingredient_id),
        ).length;

        return (
          <Box
            key={cat}
            mb="10"
            borderRadius="2xl"
            p="3"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
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
                <Text fontWeight="bold" color="gray.900" lineHeight="1">
                  {cat}
                </Text>
                <Text fontSize="xs" color="gray.600" lineHeight="1">
                  {selectedCount}/{list.length} Ingredients
                </Text>
              </VStack>
            </HStack>

            <Box
              bg="#AEBED9" // dark gray panel (change if you want darker)
              borderRadius="2xl"
              p="3"
            >
              <Wrap spacing="2" spacingY="2">
                {list.map((item) => (
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
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
          >
            <HStack align="start" spacing="3" mb="5">
              <VStack align="start" spacing="1">
                <Text fontWeight="bold" color="gray.900" lineHeight="0.9">
                  Other
                </Text>
                <Text fontSize="xs" color="gray.600" lineHeight="0.9">
                  {selectedCount}/{other.length} Ingredients
                </Text>
              </VStack>
            </HStack>

            <Box
              bg="#AEBED9" // dark gray panel (change if you want darker)
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
