import { useState } from "react";
import { useUser } from "../context/UserProvider.jsx";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Text,
  Link,
  VStack,
  Image,
} from "@chakra-ui/react";

import googleIcon from "../assets/google.png";

export default function Login() {
  const { loginWithGoogle, loading } = useUser();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Google sign in failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("Please use Google sign in for authentication.");
  };

  return (
    <Box height="85vh" display="flex" flexDirection="column" bg="transparent">
      {/* Top Right Sign Up/Login Link */}
      <Box display="flex" justifyContent="flex-end" p={6}>
        <Link
          color="black"
          fontSize="lg"
          fontWeight="semibold"
          onClick={() => setIsSignup(!isSignup)}
          cursor="pointer"
        >
          {isSignup ? "Login" : "Sign Up"}
        </Link>
      </Box>

      {/* Center Content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <VStack justify="center" spacing={6} maxW="450px" w="100%" px={6}>
          

          {/* Title */}
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="blue.400"
            textAlign="center"
          >
            MhobFinder
          </Text>

          {isSignup ? (
            // SIGNUP FORM
            <>
              {/* Description */}
              <Text
                fontSize="md"
                color="gray.700"
                textAlign="center"
                lineHeight="1.6"
              >
                Create an account to get started. Sign up with Google or enter
                your details below.
              </Text>

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <VStack spacing={4} w="100%">
                  {/* Google Button */}
                  <Button
                    w="100%"
                    py={6}
                    fontSize="lg"
                    fontWeight="semibold"
                    bg="white"
                    color="black"
                    border="2px solid black"
                    borderRadius="12px"
                    leftIcon={
                      <Image
                        src={googleIcon}
                        alt="Google Logo"
                        w="32px"
                        h="32px"
                      />
                    }
                    _hover={{ bg: "gray.100" }}
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Continue with google"}
                  </Button>

                  {/* Or Divider */}
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    or
                  </Text>

                  {/* Email Input */}
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    p={4}
                    bg="white"
                    border="2px solid black"
                    borderRadius="12px"
                    fontSize="lg"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />

                  {/* Password Input */}
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    p={4}
                    bg="white"
                    border="2px solid black"
                    borderRadius="12px"
                    fontSize="lg"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />

                  {/* Confirm Password Input */}
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    p={4}
                    bg="white"
                    border="2px solid black"
                    borderRadius="12px"
                    fontSize="lg"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />

                  {error && (
                    <Text color="red.500" fontSize="sm" textAlign="center">
                      {error}
                    </Text>
                  )}

                  {/* Sign Up Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    colorScheme="blue"
                    w="100%"
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="8px"
                    bg="#4975BB"
                    _hover={{ bg: "#3a5e9c" }}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </VStack>
              </form>
            </>
          ) : (
            // LOGIN FORM
            <>
              {/* Description */}
              <Text
                fontSize="md"
                color="gray.700"
                textAlign="center"
                lineHeight="1.6"
              >
                To interact more with this website, please sign in or create an
                account.
              </Text>

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <VStack spacing={4} w="100%">
                  {/* Google Button */}
                  <Button
                    w="100%"
                    py={6}
                    fontSize="lg"
                    fontWeight="semibold"
                    bg="white"
                    color="black"
                    border="2px solid black"
                    borderRadius="12px"
                    leftIcon={
                      <Image
                        src="/assets/n.png"
                        alt="Google Logo"
                        w="32px"
                        h="32px"
                      />
                    }
                    _hover={{ bg: "gray.100" }}
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Continue with google"}
                  </Button>

                  {/* Or Divider */}
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    or
                  </Text>

                  {/* Email Input */}
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    p={4}
                    bg="white"
                    border="2px solid black"
                    borderRadius="12px"
                    fontSize="lg"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />

                  {error && (
                    <Text color="red.500" fontSize="sm" textAlign="center">
                      {error}
                    </Text>
                  )}

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    colorScheme="blue"
                    w="100%"
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="8px"
                    bg="#4975BB"
                    _hover={{ bg: "#3a5e9c" }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </VStack>
              </form>

              {/* Forgot Password Link */}
              <Link color="blue.500" fontSize="sm" mt={2} cursor="pointer">
                Forgot Password
              </Link>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
