import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import AddFoodForm from "../../components/admin/addFood/AddFoodForm";
import { colors } from "../../theme/tokens.js";

export default function AddFood() {
  return (
    <Box
      h="100%"
      overflow="auto"
      overflowX="hidden"
      pr={1}
    >
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 6 }}
        minH="100%"
      >
        <Box mb={5}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
            Add Food
          </Text>
          <Text color="gray.600" mt={1}>
            Build a complete recipe card with category, ingredients, media, and optional source link.
          </Text>
        </Box>

        <HStack mb={6} gap={3} flexWrap="wrap">
          <Badge bg="#edf4ff" color={colors.darkest} px={3} py={1.5} borderRadius="full">
            Required: Title, Description, Category, Ingredients, Image
          </Badge>
          <Badge
            bg="#f8fbff"
            color={colors.darkest}
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="#dbe5f4"
          >
            Cleaner form layout
          </Badge>
        </HStack>

        <AddFoodForm />
      </Box>
    </Box>
  );
}
