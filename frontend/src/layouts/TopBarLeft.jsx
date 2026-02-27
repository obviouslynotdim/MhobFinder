import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useApp } from "../context/AppProvider.jsx";

export default function TopBarLeft({ collapsed, onToggleCollapse }) {
  const { selectedIds } = useApp();

  return (
    <HStack w="full" justify="space-between">
      <HStack gap="3">
        <IconButton
          aria-label="Toggle sidebar"
          onClick={onToggleCollapse}
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <FiMenu />
        </IconButton>

        {!collapsed && (
          <VStack align="start" gap="0">
            <Text fontSize="xl" fontWeight="bold" color="white" lineHeight="1">
              MhobFinder
            </Text>
            <Text fontSize="xs" color="whiteAlpha.800">
              You have {selectedIds.length} ingredient
              {selectedIds.length !== 1 ? "s" : ""}
            </Text>
          </VStack>
        )}
      </HStack>
    </HStack>
  );
}
