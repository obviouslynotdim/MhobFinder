import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";
import { useUser } from "../context/UserProvider.jsx";
import { colors } from "../theme/tokens.js";

import googleIcon from "../assets/google.png";

export default function Login() {
  const { loginWithGoogle, loading, user } = useUser();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [googleIconFailed, setGoogleIconFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(user.isAdmin ? "/admin/add-food" : "/", { replace: true });
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError("Google sign in failed. Please try again.");
    }
  };

  const handleBackToMain = () => navigate("/");

  return (
    <Box minH="85vh" display="flex" flexDirection="column" bg="transparent">
      <Box display="flex" justifyContent="space-between" p={6}>
        <Link
          color={colors.dark}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          onClick={handleBackToMain}
          cursor="pointer"
          textDecoration="none"
          _hover={{ color: colors.primary, textDecoration: "underline" }}
        >
          <HStack as="span" spacing={2} align="center">
            <FiArrowLeft size={18} />
            <Text as="span">Back to Main</Text>
          </HStack>
        </Link>
        <Link
          color={colors.dark}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          onClick={() => setIsSignup(!isSignup)}
          cursor="pointer"
          textDecoration="none"
          _hover={{ color: colors.primary, textDecoration: "underline" }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </Link>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
        <VStack
          justify="center"
          spacing={6}
          maxW="460px"
          w="100%"
          px={6}
          py={8}
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
        >
          <Text fontSize="4xl" fontWeight="bold" color="blue.400" textAlign="center">
            MhobFinder
          </Text>

          <Text fontSize="md" color="gray.700" textAlign="center" lineHeight="1.6">
            {isSignup
              ? "Create your account instantly with Google."
              : "Sign in instantly with your Google account."}
          </Text>

          <Button
            w="100%"
            py={6}
            fontSize="lg"
            fontWeight="semibold"
            bg="white"
            color={colors.darkest}
            border="1px solid"
            borderColor={colors.primary}
            borderRadius="12px"
            _hover={{ bg: colors.chipBg }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <HStack spacing={3} align="center">
              {googleIconFailed ? (
                <FcGoogle size={24} />
              ) : (
                <Image
                  src={googleIcon}
                  alt="Google Logo"
                  w="32px"
                  h="32px"
                  onError={() => setGoogleIconFailed(true)}
                />
              )}
              <Text as="span">
                {loading
                  ? "Connecting..."
                  : isSignup
                    ? "Continue with Google"
                    : "Sign in with Google"}
              </Text>
            </HStack>
          </Button>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
