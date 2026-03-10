import { Box, HStack, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { colors } from "../theme/tokens.js";

/**
 * A single ingredient pill/chip.
 *
 * Props:
 *   name     {string}   – ingredient label
 *   onRemove {function} – called when the × button is clicked
 */
export default function IngredientChip({ name, onRemove }) {
  return (
    <HStack
      gap="1"
      px="3"
      py="1"
      bg={colors.chipBg}
      border="1px solid"
      borderColor={colors.primary}
      borderRadius="full"
      boxShadow="0 1px 3px rgba(73,117,187,0.15)"
      transition="all 0.15s ease"
      _hover={{ bg: colors.chipHover, boxShadow: "0 1px 5px rgba(73,117,187,0.25)" }}
    >
      <Text fontSize="xs" fontWeight="semibold" color={colors.darkest} lineHeight="1">
        {name}
      </Text>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="14px"
        h="14px"
        borderRadius="full"
        bg={colors.primary}
        color="white"
        cursor="pointer"
        flexShrink="0"
        _hover={{ bg: colors.dark }}
        onClick={onRemove}
        aria-label={`Remove ${name}`}
      >
        <FiX size={8} />
      </Box>
    </HStack>
  );
}
