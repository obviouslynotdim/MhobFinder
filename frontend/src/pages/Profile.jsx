import { Avatar, Box, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider.jsx";
import { colors } from "../theme/tokens.js";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <Box p="8" textAlign="center">
        <Text color="gray.500">Please log in to view your profile.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 6, md: 10 }} maxW="480px" mx="auto">
      <Box
        bg={colors.adminCard}
        borderRadius="xl"
        p="8"
        boxShadow="md"
      >
        <VStack gap="4" align="center">
          <Avatar.Root size="2xl">
            <Avatar.Image src={user.photoURL} />
            <Avatar.Fallback name={user.name} bg={colors.primary} color="white" />
          </Avatar.Root>

          <VStack gap="1" textAlign="center">
            <Text fontWeight="bold" fontSize="xl" color={colors.darkest}>
              {user.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {user.email}
            </Text>
            {user.isAdmin && (
              <Box
                px="3"
                py="0.5"
                bg={colors.primary}
                color="white"
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
              >
                Admin
              </Box>
            )}
          </VStack>

          <Button
            mt="2"
            w="full"
            variant="outline"
            borderColor={colors.primary}
            color={colors.dark}
            _hover={{ bg: colors.chipBg }}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

