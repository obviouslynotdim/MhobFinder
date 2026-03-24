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
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

import googleIcon from "../../assets/google.png";

export default function Login() {
  const { loginWithGoogle, loading, user } = useUser();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [googleIconFailed, setGoogleIconFailed] = useState(false);

  // Redirect already-logged-in users immediately
  useEffect(() => {
    if (!user || loading) return;
    // User is already logged in, redirect to their home
    const destination = user.isAdmin ? "/admin/add-food" : "/home";
    navigate(destination, { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      // Provide specific error messages based on error type
      let errorMessage = "Google sign in failed. Please try again.";
      
      if (err?.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (err?.code === "auth/popup-blocked") {
        errorMessage = "Sign-in popup was blocked. Please allow popups and try again.";
      } else if (err?.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err?.message?.includes("Email already")) {
        errorMessage = "This email is already registered. Please use your existing account.";
      }
      
      setError(errorMessage);
      console.error("Google sign in error:", err);
    }
  };

  const handleBackToMain = () => navigate("/home");

  // While loading auth state, don't show login form yet
  if (loading) {
    return (
      <AppLoadingState
        title="Loading..."
        description="Please wait while we verify your session."
        fullScreen={false}
        minH="50vh"
      />
    );
  }

  // User is already logged in - useEffect will redirect them
  // Show nothing while redirect happens (it's very fast)
  if (user) {
    return null;
  }

  return (
    <Box
      minH={{ base: "65vh", md: "70vh" }}
      display="flex"
      flexDirection="column"
      px={{ base: 3, md: 6 }}
      py={{ base: 4, md: 6 }}
      overflow="hidden"
    >
      {/* Top nav bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={{ base: "2", md: "3" }}
        flexWrap="wrap"
        mb={{ base: "3", md: "4" }}
        maxW="960px"
        mx="auto"
        w="full"
      >
        <Link
          color={colors.dark}
          fontSize={{ base: "xs", md: "md" }}
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
          size={{ base: "xs", md: "sm" }}
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
          maxW={{ base: "420px", md: "460px" }}
          w="full"
          mx="auto"
          bg="white"
          borderRadius="3xl"
          p={{ base: 4, md: 8 }}
          border="1px solid"
          borderColor="#CFE0FA"
          boxShadow="0 18px 18px rgba(43,76,126,0.12)"
        >
          <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
            <Text
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="800"
              color={colors.darkest}
              textAlign="center"
            >
              {isRegister ? "Register" : "Login"}
            </Text>

            <Text
              fontSize={{ base: "xs", md: "sm" }}
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
              py={{ base: 6, md: 7 }}
              fontSize={{ base: "sm", md: "md" }}
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
              <HStack spacing={{ base: 2, md: 3 }} align="center">
                {loading ? (
                  <Spinner size="sm" color={colors.primary} thickness="3px" />
                ) : googleIconFailed ? (
                  <FcGoogle size={20} />
                ) : (
                  <Image
                    src={googleIcon}
                    alt="Google Logo"
                    w={{ base: "24px", md: "28px" }}
                    h={{ base: "24px", md: "28px" }}
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
                px={{ base: "3", md: "4" }}
                py={{ base: "2.5", md: "3" }}
              >
                <Text
                  color="red.600"
                  fontSize={{ base: "xs", md: "sm" }}
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
