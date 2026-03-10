import { Box, Flex, HStack, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { FiExternalLink, FiHeart } from "react-icons/fi";
import { MdOutlineFoodBank } from "react-icons/md";
import { colors } from "../theme/tokens.js";

function formatDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function RecipeCard({ food, isFavorite, onToggleFavorite, onView }) {
  const ingredientCount = food.ingredients?.length ?? 0;

  return (
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
          fontSize={{ base: "sm", md: "md" }}
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
            py="1"
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
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(food.food_id);
            }}
            bg={isFavorite ? "red.500" : "white"}
            color={isFavorite ? "white" : "red.400"}
            border="1px solid"
            borderColor={isFavorite ? "red.500" : "red.200"}
            _hover={{ opacity: 0.85 }}
            borderRadius="md"
            size="xs"
            flexShrink="0"
          >
            <FiHeart />
          </IconButton>
        </HStack>
      </VStack>
    </Flex>
  );
}
