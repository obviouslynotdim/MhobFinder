import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHeart,
  FiHome,
  FiInfo,
  FiPlusSquare,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { useApp } from "../context/AppProvider.jsx";

function chipBg(color) {
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
  "Pantry Essential",
  "Sauces & Condiments",
  "Noodles & Grains",
  "Seafoods",
  "Proteins",
  "Vegetables",
  "Fruits",
  "Aromatics & Herbs",
  "Spices & Heat",
];

function groupByCategory(ingredients) {
  const map = new Map();
  const allowed = new Set(CATEGORY_ORDER);

  for (const ing of ingredients) {
    const raw = (ing.category || "").trim();
    const cat = allowed.has(raw) ? raw : "Other";

    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(ing);
  }

  return map;
}

export default function Sidebar({ collapsed }) {
  const { ingredients, selectedIds, toggleIngredient } = useApp();
  const loc = useLocation();

  const navItems = [
    { to: "/", icon: <FiHome />, label: "Home" },
    { to: "/favorites", icon: <FiHeart />, label: "Favorites" },
    { to: "/admin/add-food", icon: <FiPlusSquare />, label: "Add Food" },
    { to: "/admin/manage-user", icon: <FiUsers />, label: "Manage User" },
    { to: "/admin/analytical", icon: <FiBarChart2 />, label: "Analytical" },
    { to: "/about", icon: <FiInfo />, label: "About" },
  ];

  if (collapsed) {
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

  const grouped = groupByCategory(ingredients);

  return (
    <Box p="4" color="white">
      <VStack align="stretch" gap="2" mb="6">
        {navItems.map((n) => (
          <Box
            key={n.to}
            as={Link}
            to={n.to}
            p="3"
            borderRadius="xl"
            bg={loc.pathname === n.to ? "whiteAlpha.200" : "transparent"}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <HStack spacing="3">
              <Box fontSize="xl">{n.icon}</Box>
              <Text fontWeight="bold">{n.label}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      {CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) || [];
        if (list.length === 0) return null;

        const selectedCount = list.filter((x) =>
          selectedIds.includes(x.ingredient_id)
        ).length;

        return (
          <Box
            key={cat}
            mb="10"
            borderRadius="2xl"
            p="3"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
          >
            <VStack align="start" spacing="1" mb="5">
              <Text fontWeight="bold" color="gray.900" lineHeight="0.9">
                {cat}
              </Text>
              <Text fontSize="xs" color="gray.600" lineHeight="0.9">
                {selectedCount}/{list.length} Ingredients
              </Text>
            </VStack>

            <Box bg="#AEBED9" borderRadius="2xl" p="3">
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

      {(() => {
        const other = grouped.get("Other") || [];
        if (!other.length) return null;

        const selectedCount = other.filter((x) =>
          selectedIds.includes(x.ingredient_id)
        ).length;

        return (
          <Box
            mb="2"
            borderRadius="2xl"
            p="3"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
          >
            <VStack align="start" spacing="1" mb="5">
              <Text fontWeight="bold" color="gray.900" lineHeight="0.9">
                Other
              </Text>
              <Text fontSize="xs" color="gray.600" lineHeight="0.9">
                {selectedCount}/{other.length} Ingredients
              </Text>
            </VStack>

            <Box bg="#AEBED9" borderRadius="2xl" p="3">
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