import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiExternalLink, FiHeart, FiSearch } from "react-icons/fi";
import { MdOutlineFoodBank } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { colors } from "../theme/tokens.js";
import FullRecipe from "./fullRecipePage/FullRecipe.jsx";

function formatDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function FavoriteCard({ food, selectedIds, onToggleFavorite, onView }) {
  const ingredientIds = (food.ingredients || []).map((ing) => ing.ingredient_id);
  const matchedCount = ingredientIds.filter((id) => selectedIds.includes(id)).length;
  const totalCount = ingredientIds.length;
  const metaColor = "gray.500";

  let matchLabel = "No ingredient data";
  if (totalCount > 0) {
    matchLabel = `You have matched ${matchedCount} ingredient${matchedCount === 1 ? "" : "s"}`;
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0 1px 4px rgba(0,0,0,0.06)"
      transition="box-shadow 0.15s, transform 0.15s"
      _hover={{
        boxShadow: "0 4px 16px rgba(73,117,187,0.13)",
        transform: "translateY(-2px)",
      }}
      cursor="pointer"
      onClick={() => onView(food)}
      h={{ base: "auto", md: "120px" }}
    >
      <Box
        w={{ base: "100%", md: "120px" }}
        h={{ base: "160px", md: "120px" }}
        flexShrink={0}
        overflow="hidden"
        position="relative"
      >
        <Image
          src={food.image_url}
          alt={food.title}
          w="100%"
          h="100%"
          objectFit="cover"
          fallback={
            <Flex
              w="100%"
              h="100%"
              align="center"
              justify="center"
              bg={colors.chipBg}
            >
              <MdOutlineFoodBank size={32} color={colors.primary} />
            </Flex>
          }
        />
      </Box>

      <Flex
        flex="1"
        px="4"
        py="3"
        direction="column"
        justify="space-between"
        overflow="hidden"
        minW={0}
      >
        <Text
          fontWeight="700"
          fontSize="sm"
          color={colors.darkest}
          lineClamp={2}
          lineHeight="1.45"
        >
          {food.title}
        </Text>

        {food.link_url && (
          <HStack
            as="a"
            href={food.link_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            gap="1"
            color={metaColor}
            _hover={{ textDecoration: "underline", color: colors.darkest }}
            maxW="full"
            overflow="hidden"
          >
            <Text fontSize="xs" isTruncated>
              {formatDomain(food.link_url)}
            </Text>
          </HStack>
        )}

        <Text fontSize="xs" color={metaColor} mt="auto">
          {matchLabel}
        </Text>
      </Flex>

      <Flex
        align="center"
        justify={{ base: "flex-end", md: "center" }}
        pr="3"
        pb={{ base: "3", md: "0" }}
        gap="1.5"
        flexShrink={0}
      >
        <IconButton
          aria-label="Remove from favorites"
          size="sm"
          borderRadius="full"
          variant="ghost"
          color="red.400"
          _hover={{ bg: "red.50", color: "red.600" }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.food_id);
          }}
        >
          <FiHeart />
        </IconButton>
        {food.link_url && (
          <IconButton
            as="a"
            href={food.link_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open recipe source"
            size="sm"
            borderRadius="full"
            variant="ghost"
            color="gray.900"
            _hover={{ bg: colors.chipBg, color: colors.darkest }}
            onClick={(e) => e.stopPropagation()}
          >
            <FiExternalLink />
          </IconButton>
        )}
        
      </Flex>
    </Flex>
  );
}

export default function Favorites() {
  const nav = useNavigate();
  const { favorites, rawFoods, selectedIds, toggleFavorite } = useApp();
  const [query, setQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const favoriteFoods = rawFoods.filter((f) => favorites.includes(f.food_id));

  const displayedFoods = query.trim()
    ? favoriteFoods.filter((f) =>
        (f.title || "").toLowerCase().includes(query.trim().toLowerCase()),
      )
    : favoriteFoods;

  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
      {/* ── Page header ── */}
      <HStack gap="3" mb={6} align="center">
        <Box flex="1">
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="800"
            color={colors.darkest}
            lineHeight="1.2"
          >
            My Favorites
          </Text>
          <Text fontSize="sm" color="gray.500" mt="0.5">
            {favoriteFoods.length} saved recipe
            {favoriteFoods.length === 1 ? "" : "s"}
          </Text>
        </Box>
      </HStack>

      {/* ── Search ── */}
      {favoriteFoods.length > 0 && (
        <HStack
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 1px 3px rgba(0,0,0,0.05)"
          px="3"
          py="2"
          gap="2"
          mb={5}
        >
          <FiSearch color={colors.primary} size={15} />
          <Input
            placeholder="Search your favorites…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            border="none"
            bg="transparent"
            color={colors.darkest}
            _placeholder={{ color: "gray.400" }}
            fontSize="sm"
            p="0"
            h="auto"
            _focus={{ outline: "none", boxShadow: "none" }}
          />
        </HStack>
      )}

      {/* ── States ── */}
      {favoriteFoods.length === 0 ? (
        <Center py="20">
          <VStack gap="5" textAlign="center">
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg={colors.chipBg}
              align="center"
              justify="center"
            >
              <FiHeart size={26} color={colors.primary} />
            </Flex>
            <VStack gap="1">
              <Text fontWeight="700" fontSize="lg" color={colors.darkest}>
                No saved recipes yet
              </Text>
              <Text fontSize="sm" color="gray.500" maxW="260px">
                Tap the heart on any recipe to save it here for quick access.
              </Text>
            </VStack>
            <Button
              bg={colors.primary}
              color="white"
              borderRadius="xl"
              fontWeight="600"
              px="6"
              _hover={{ bg: colors.dark }}
              onClick={() => nav("/home")}
            >
              Browse recipes
            </Button>
          </VStack>
        </Center>
      ) : displayedFoods.length === 0 ? (
        <Center py="14">
          <VStack gap="2" textAlign="center">
            <FiSearch size={22} color="gray" />
            <Text fontWeight="600" color={colors.darkest} fontSize="sm">
              No results for &ldquo;{query}&rdquo;
            </Text>
            <Text fontSize="xs" color="gray.500">
              Try a different search term.
            </Text>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 3, md: 4 }}>
          {displayedFoods.map((food) => (
            <FavoriteCard
              key={food.food_id}
              food={food}
              selectedIds={selectedIds}
              onToggleFavorite={toggleFavorite}
              onView={setSelectedRecipe}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ── Full Recipe Modal ── */}
      {selectedRecipe && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="blackAlpha.600"
            zIndex="9"
            onClick={() => setSelectedRecipe(null)}
          />
          <FullRecipe
            foodId={selectedRecipe.food_id}
            onClose={() => setSelectedRecipe(null)}
          />
        </>
      )}
    </Box>
  );
}
