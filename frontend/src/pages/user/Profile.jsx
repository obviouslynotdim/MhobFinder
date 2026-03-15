import {
  Avatar,
  Box,
  Button,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider.jsx";
import { colors } from "../../theme/tokens.js";

export default function Profile() {
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Box p={{ base: 8, md: 10 }} textAlign="center">
        <VStack gap="3">
          <Spinner size="lg" color={colors.primary} thickness="4px" />
          <Text color={colors.dark}>Loading profile...</Text>
        </VStack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={{ base: 8, md: 10 }} textAlign="center">
        <VStack gap="4">
          <Text color={colors.dark}>Please log in to view your profile.</Text>
          <Button
            onClick={() => navigate("/login")}
            bg={colors.primary}
            color="white"
            _hover={{ bg: colors.dark }}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={{ base: 6, md: 10 }} maxW="560px" mx="auto">
      <Box
        bg="white"
        border="1px solid"
        borderColor="#CFE0FA"
        borderRadius="2xl"
        position="relative"
        p="8"
        boxShadow="0 14px 35px rgba(43,76,126,0.12)"
      >
        <IconButton
          aria-label="Edit profile"
          position="absolute"
          top="4"
          right="4"
          size="sm"
          variant="outline"
          borderColor="#CFE0FA"
          color={colors.dark}
          _hover={{ bg: colors.chipBg }}
          onClick={() => navigate("/profile/edit")}
        >
          <FiEdit2 />
        </IconButton>

        <VStack gap="5" align="center">
          <Text fontWeight="800" fontSize="2xl" color={colors.darkest}>
            My Profile
          </Text>

          <Avatar.Root size="2xl">
            <Avatar.Image src={user.photoURL} />
            <Avatar.Fallback
              name={user.name}
              bg={colors.primary}
              color="white"
            />
          </Avatar.Root>

          <VStack gap="1" textAlign="center">
            <Text fontWeight="bold" fontSize="xl" color={colors.darkest}>
              {user.name}
            </Text>
            <Text fontSize="sm" color={colors.dark}>
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

          <Box
            w="full"
            pt="2"
            display="grid"
            gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
            gap="3"
          >
            <Button
              w="full"
              variant="outline"
              borderColor={colors.primary}
              color={colors.dark}
              _hover={{ bg: colors.chipBg }}
              onClick={() => navigate("/home")}
            >
              Back to Home
            </Button>

            <Button
              w="full"
              bg={colors.primary}
              color="white"
              _hover={{ bg: colors.dark }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
