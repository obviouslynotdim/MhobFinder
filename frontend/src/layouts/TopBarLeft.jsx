import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiMenu, FiMoreVertical, FiSearch, FiTrash2 } from "react-icons/fi";
import { useApp } from "../context/AppProvider.jsx";
import { useTranslation } from "../context/useTranslation.js";
import { colors } from "../theme/tokens.js";

export default function TopBarLeft({ collapsed, onToggleCollapse }) {
  const { language, t } = useTranslation();
  const { ingredients, selectedIds, toggleIngredient, clearIngredients } =
    useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ingSearch, setIngSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(ingSearch.toLowerCase()),
  );

  function handleIngSearchChange(e) {
    setIngSearch(e.target.value);
    setDrawerOpen(e.target.value.length > 0);
  }

  function handleSelect(id) {
    toggleIngredient(id);
    setIngSearch("");
    setDrawerOpen(false);
    inputRef.current?.focus();
  }

  function handleConfirmClearAll() {
    clearIngredients();
    setConfirmOpen(false);
    setMenuOpen(false);
  }

  if (collapsed) {
    return (
      <HStack w="full" justify="center">
        <IconButton
          aria-label="Toggle sidebar"
          onClick={onToggleCollapse}
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <FiMenu />
        </IconButton>
      </HStack>
    );
  }

  return (
    <VStack w="full" gap="2" align="stretch">
      {/* ── Row 1: hamburger | Pantry title | 3-dot menu ── */}
      <HStack w="full" position="relative" justify="center">
        {/* Left: hamburger */}
        <Box position="absolute" left="0">
          <IconButton
            aria-label="Toggle sidebar"
            onClick={onToggleCollapse}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiMenu />
          </IconButton>
        </Box>

        {/* Center: Pantry + count */}
        <VStack gap="0" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="white" lineHeight="1">
            {t("topBar.pantryTitle")}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800">
            {t("topBar.pantryCount", { count: selectedIds.length })}
          </Text>
        </VStack>

        {/* Right: 3-dot menu */}
        <Box position="absolute" right="0">
          <IconButton
            aria-label="More options"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <FiMoreVertical />
          </IconButton>

          {menuOpen && (
            <Box
              position="absolute"
              right="0"
              top="100%"
              zIndex="popover"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              minW="160px"
              py="1"
            >
              <Box
                px="4"
                py="2"
                fontSize="sm"
                color="red.500"
                cursor="pointer"
                _hover={{ bg: "red.50" }}
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
              >
                <HStack gap="2">
                  <FiTrash2 size={13} />
                  <Text fontSize={12}>
                    {t("topBar.clearAllIngredients")}
                  </Text>
                </HStack>
              </Box>
            </Box>
          )}
        </Box>
      </HStack>

      {confirmOpen && (
        <>
          <Box
            position="fixed"
            inset="0"
            bg="blackAlpha.400"
            zIndex="modal"
            onClick={() => setConfirmOpen(false)}
          />

          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="modal"
            bg="white"
            border="1px solid"
            borderColor={`${colors.primary}55`}
            borderRadius="xl"
            boxShadow="0 14px 36px rgba(43,76,126,0.2)"
            w={{ base: "90vw", sm: "420px" }}
            p="5"
          >
            <Text fontWeight="bold" fontSize="lg" color={colors.darkest} mb="2">
              {t("topBar.removeAllIngredientsTitle")}
            </Text>
            <Text fontSize="sm" color={colors.dark} mb="5">
              {t("topBar.removeAllIngredientsDesc")}
            </Text>

            <HStack justify="flex-end" gap="2">
              <Button
                variant="outline"
                borderColor={colors.primary}
                color={colors.dark}
                _hover={{ bg: colors.chipHover }}
                onClick={() => setConfirmOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button bg={colors.primary} color="white" _hover={{ bg: colors.dark }} onClick={handleConfirmClearAll}>
                {t("common.ok")}
              </Button>
            </HStack>
          </Box>
        </>
      )}

      {/* ── Row 2: ingredient search ── */}
      <Box position="relative">
        {/* Search input */}
        <InputGroup
          w="full"
          startElement={<FiSearch size="18" color="#718096" />}
        >
          <Input
            ref={inputRef}
            value={ingSearch}
            onChange={handleIngSearchChange}
            onFocus={() => ingSearch.length > 0 && setDrawerOpen(true)}
            onBlur={() => setTimeout(() => setDrawerOpen(false), 150)}
            placeholder={t("topBar.inputIngredient")}
            bg="white"
            borderRadius="md"
            h="40px"
          />
        </InputGroup>

        {/* Drop-down suggestions */}
        {drawerOpen && filteredIngredients.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left="0"
            right="0"
            zIndex="dropdown"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            maxH="220px"
            overflowY="auto"
            mt="1"
          >
            {filteredIngredients.map((i) => {
              const isSelected = selectedIds.includes(i.ingredient_id);
              return (
                <HStack
                  key={i.ingredient_id}
                  px="3"
                  py="2"
                  cursor="pointer"
                  bg={isSelected ? "blue.50" : "white"}
                  _hover={{ bg: isSelected ? "blue.100" : "gray.50" }}
                  onMouseDown={() => handleSelect(i.ingredient_id)}
                  justify="space-between"
                >
                  <Text fontSize="sm" color="gray.800">
                    {i.name}
                  </Text>
                  {isSelected && (
                    <Text fontSize="xs" color="blue.500">
                      {t("topBar.ingredientAdded")}
                    </Text>
                  )}
                </HStack>
              );
            })}
          </Box>
        )}
      </Box>
    </VStack>
  );
}
