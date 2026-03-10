    import { Box, Text } from "@chakra-ui/react";

export default function AdminFavorites() {
  return (
    <Box p="6">
      <Text fontSize="2xl" fontWeight="bold">
        Admin Favorites
      </Text>

      <Text mt="4">
        This page shows favorite recipes or items for the admin.
      </Text>
    </Box>
  );
}