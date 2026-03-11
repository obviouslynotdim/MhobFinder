import { Box, Button, Flex, HStack, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { FiExternalLink, FiHeart } from "react-icons/fi";
import { MdOutlineFoodBank } from "react-icons/md";
import { colors } from "../theme/tokens.js";
import { useUser } from "../context/UserProvider.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function formatDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function RecipeCard({ food, isFavorite, onToggleFavorite, onView }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const ingredientCount = food.ingredients?.length ?? 0;
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  function handleFavoriteClick(e) {
    e.stopPropagation();
    if (!user) {
      setShowAuthDialog(true);
    } else {
      onToggleFavorite(food.food_id);
    }
  }

  return (
    <>
    <Flex
      direction={{ base: "column", md: "row" }}
      bg={colors.chipBg}
      borderRadius="xl"
      boxShadow="sm"
      overflow="hidden"
      border="1px solid"
      borderColor={`${colors.primary}30`}
      transition="all 0.2s ease"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      cursor="pointer"
      onClick={() => onView(food)}
      h={{ base: "auto", md: "190px" }}
    >
      {/* Image */}
      <Box
        w={{ base: "full", md: "190px" }}
        h={{ base: "160px", md: "full" }}
        flexShrink="0"
        overflow="hidden"
      >
        <Image
          src={food.image_url}
          alt={food.title}
          w="100%"
          h="100%"
          objectFit="cover"
          fallback={
            <Flex w="100%" h="100%" align="center" justify="center" bg={colors.pageBg}>
              <MdOutlineFoodBank size={40} color={colors.primary} />
            </Flex>
          }
        />
      </Box>

      {/* Content */}
      <VStack align="start" px="3" py="2.5" gap="1" flex="1" overflow="hidden">
        {/* Food name */}
        <Text
          fontWeight="bold"
          fontSize={{ base: "sm", md: "lg" }}
          color={colors.darkest}
          lineClamp={1}
          lineHeight="1.3"
          w="full"
        >
          {food.title}
        </Text>

        {/* Website URL */}
        {food.link_url && (
          <HStack
            gap="1"
            as="a"
            href={food.link_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            color={colors.primary}
            _hover={{ textDecoration: "underline", color: colors.dark }}
            maxW="full"
            overflow="hidden"
          >
            <FiExternalLink size={10} flexShrink={0} />
            <Text fontSize="xs" isTruncated>
              {formatDomain(food.link_url)}
            </Text>
          </HStack>
        )}

        {/* Ingredient count */}
        <HStack gap="1">
          <MdOutlineFoodBank size={13} color={colors.dark} />
          <Text fontSize="xs" color="gray.500">
            {ingredientCount} ingredient{ingredientCount !== 1 ? "s" : ""}
          </Text>
        </HStack>

        {/* Description */}
        {food.description && (
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" lineClamp={3} lineHeight="1.5">
            {food.description}
          </Text>
        )}

        {/* Actions — pushed to bottom */}
        <HStack w="full" gap="2" mt="auto">
          <Box
            as="button"
            flex="1"
            py="2"
            px="2"
            bg={colors.primary}
            color="white"
            borderRadius="md"
            fontSize="xs"
            fontWeight="semibold"
            textAlign="center"
            transition="background 0.15s"
            _hover={{ bg: colors.dark }}
            onClick={(e) => {
              e.stopPropagation();
              onView(food);
            }}
          >
            View Recipe
          </Box>

          <IconButton
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={handleFavoriteClick}
            bg={isFavorite ? "red.500" : "white"}
            color={isFavorite ? "white" : "red.500"}
            border="1px solid"
            borderColor={isFavorite ? "red.500" : "red.300"}
            _hover={{
              bg: isFavorite ? "red.600" : "red.500",
              color: isFavorite ? "white" : "red.600",
            }}
            borderRadius="md"
            size="sm"
            flexShrink="0"
          >
            <FiHeart />
          </IconButton>
        </HStack>
      </VStack>
    </Flex>

    {/* Auth required dialog */}
    {showAuthDialog && (
      <>
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.400"
          zIndex="modal"
          onClick={() => setShowAuthDialog(false)}
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
            You are not registered
          </Text>
          <Text fontSize="sm" color={colors.dark} mb="5">
            You need an account to favorite recipes. Would you like to sign up now?
          </Text>
          <HStack justify="flex-end" gap="2">
            <Button
              variant="outline"
              borderColor={colors.primary}
              color={colors.dark}
              _hover={{ bg: colors.chipHover }}
              onClick={() => setShowAuthDialog(false)}
            >
              No
            </Button>
            <Button
              bg={colors.primary}
              color="white"
              _hover={{ bg: colors.dark }}
              onClick={() => { setShowAuthDialog(false); navigate("/login"); }}
            >
              Yes
            </Button>
          </HStack>
        </Box>
      </>
    )}
    </>
  );
}
