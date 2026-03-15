import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";
import { useUser } from "../../context/UserProvider.jsx";
import { colors } from "../../theme/tokens.js";

import googleIcon from "../../assets/google.png";

export default function Login() {
  const { loginWithGoogle, loading, user } = useUser();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [googleIconFailed, setGoogleIconFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(user.isAdmin ? "/admin/add-food" : "/home", { replace: true });
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch {
      setError("Google sign in failed. Please try again.");
    }
  };

  const handleBackToMain = () => navigate("/home");

  return (
    <Box
      minH="70vh"
      display="flex"
      flexDirection="column"
      px={{ base: 4, md: 6 }}
      py={{ base: 5, md: 6 }}
      overflow="hidden"
    >
      {/* Top nav bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="3"
        flexWrap="wrap"
        mb="4"
        maxW="960px"
        mx="auto"
        w="full"
      >
        <Link
          color={colors.dark}
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="600"
          onClick={handleBackToMain}
          cursor="pointer"
          textDecoration="none"
          _hover={{ color: colors.primary }}
        >
          <HStack as="span" spacing={2} align="center">
            <FiArrowLeft size={16} />
            <Text as="span">Back to Home</Text>
          </HStack>
        </Link>

        <Button
          size="sm"
          variant="outline"
          borderColor={colors.primary}
          color={colors.darkest}
          fontWeight="700"
          borderRadius="full"
          _hover={{ bg: "white", borderColor: colors.dark }}
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Back to Login" : "Register"}
        </Button>
      </Box>

      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        <Box
          maxW="460px"
          w="full"
          mx="auto"
          bg="white"
          borderRadius="3xl"
          p={{ base: 6, md: 8 }}
          border="1px solid"
          borderColor="#CFE0FA"
          boxShadow="0 18px 18px rgba(43,76,126,0.12)"
        >
          <VStack align="stretch" spacing={5}>
            <Text
              fontSize="3xl"
              fontWeight="800"
              color={colors.darkest}
              textAlign="center"
            >
              {isRegister ? "Register" : "Login"}
            </Text>

            <Text
              fontSize="sm"
              color={colors.dark}
              lineHeight="1.7"
              textAlign="center"
            >
              {isRegister
                ? "Create your account with Google to get started."
                : "Sign in with your Google account to continue."}
            </Text>

            <Button
              w="100%"
              py={7}
              fontSize="md"
              fontWeight="700"
              bg="white"
              color={colors.darkest}
              border="1px solid"
              borderColor={colors.primary}
              borderRadius="14px"
              _hover={{ bg: colors.chipBg, borderColor: colors.dark }}
              _disabled={{ opacity: 0.75, cursor: "not-allowed" }}
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <HStack spacing={3} align="center">
                {loading ? (
                  <Spinner size="sm" color={colors.primary} thickness="3px" />
                ) : googleIconFailed ? (
                  <FcGoogle size={22} />
                ) : (
                  <Image
                    src={googleIcon}
                    alt="Google Logo"
                    w="28px"
                    h="28px"
                    onError={() => setGoogleIconFailed(true)}
                  />
                )}
                <Text as="span">
                  {loading
                    ? "Connecting..."
                    : isRegister
                      ? "Continue with Google"
                      : "Sign in with Google"}
                </Text>
              </HStack>
            </Button>

            {error && (
              <Box
                border="1px solid"
                borderColor="red.200"
                bg="red.50"
                borderRadius="lg"
                px="4"
                py="3"
              >
                <Text
                  color="red.600"
                  fontSize="sm"
                  textAlign="left"
                  fontWeight="500"
                >
                  {error}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
