import { Box, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

/**
 * AppAlert - Reusable alert/notification widget
 * @param {string} type - 'success' | 'error' | 'info' (default: 'info')
 * @param {string} message - Main message to display
 * @param {string} [description] - Optional subtext
 * @param {object} [sx] - Optional style overrides
 */
export default function AppAlert({ type = "info", message, description, sx = {} }) {
  let color, icon;
  switch (type) {
    case "success":
      color = "green.500";
      icon = <FiCheckCircle size={22} style={{ marginRight: 8 }} />;
      break;
    case "error":
      color = "red.500";
      icon = <FiAlertCircle size={22} style={{ marginRight: 8 }} />;
      break;
    default:
      color = "blue.500";
      icon = <FiInfo size={22} style={{ marginRight: 8 }} />;
  }
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      bg="white"
      borderLeftWidth={4}
      borderLeftColor={color}
      borderRadius="md"
      boxShadow="sm"
      px={4}
      py={3}
      mb={3}
      {...sx}
    >
      <Box color={color} mt={0.5}>{icon}</Box>
      <Box flex={1} ml={2}>
        <Text fontWeight="bold" color={color} fontSize="md">{message}</Text>
        {description && (
          <Text color="gray.700" fontSize="sm" mt={1}>{description}</Text>
        )}
      </Box>
    </Box>
  );
}
