import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { colors } from "../../theme/tokens.js";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const quickStats = [
  { label: "Active recipes", value: "1,200+" },
  { label: "Pantry ingredients", value: "250+" },
  { label: "Average setup", value: "< 30 s" },
];

const sampleIngredients = [
  "Garlic",
  "Eggs",
  "Rice",
  "Lemongrass",
  "Tomato",
  "Chicken",
  "Soy Sauce",
  "Basil",
];

const sampleRecipes = [
  { title: "Chicken Fried Rice", match: "6 / 8 ingredients" },
  { title: "Garlic Basil Stir Fry", match: "5 / 8 ingredients" },
  { title: "Tomato Egg Soup", match: "4 / 8 ingredients" },
];

export default function Start() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("EN");

  return (
    <Box
      minH="full"
      bg="linear-gradient(160deg, #FAFCFF 0%, #EFF5FF 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* ── Navbar ── */}
      <Flex
        as="nav"
        position="relative"
        zIndex="10"
        maxW="1280px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py="5"
        align="center"
        justify="space-between"
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="900"
          color={colors.darkest}
          letterSpacing="-0.03em"
        >
          MhobFinder
        </Text>

        <HStack gap="3">
          {/* Language toggle */}
          <HStack
            gap="0"
            bg="white"
            p="1"
            borderRadius="full"
            border="1px solid #D2DEF5"
            boxShadow="0 1px 4px rgba(0,0,0,0.06)"
          >
            {["EN", "KH"].map((l) => (
              <Button
                key={l}
                size="sm"
                borderRadius="full"
                fontWeight="700"
                fontSize="xs"
                px="4"
                bg={lang === l ? colors.primary : "transparent"}
                color={lang === l ? "white" : colors.dark}
                _hover={{ bg: lang === l ? colors.dark : "#EDF3FF" }}
                onClick={() => setLang(l)}
              >
                {l}
              </Button>
            ))}
          </HStack>

          <Button
            size="sm"
            borderRadius="full"
            variant="outline"
            borderColor={colors.primary}
            color={colors.darkest}
            fontWeight="700"
            _hover={{ bg: "white" }}
            onClick={() => navigate("/login")}
          >
            Register
          </Button>
        </HStack>
      </Flex>

      {/* ── Hero + Preview ── */}
      <Flex
        position="relative"
        zIndex="1"
        flex="1"
        align="center"
        minH="calc(100vh - 90px)"
      >
        <Box
          w="full"
          maxW="1280px"
          mx="auto"
          px={{ base: 5, md: 10 }}
          pt={{ base: 4, md: 6 }}
          pb={{ base: 10, md: 14 }}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
            gap={{ base: 10, md: 12 }}
            alignItems="center"
          >
            {/* Left — Copy */}
            <GridItem animation={`${fadeIn} 600ms ease-out`}>
              <VStack align="start" gap="6">
                <Badge
                  px="3.5"
                  py="1"
                  borderRadius="full"
                  bg="#D6E5FF"
                  color={colors.dark}
                  textTransform="none"
                  fontWeight="700"
                  fontSize="xs"
                >
                  100 % free — no ads, no sign-up walls
                </Badge>

                <Text
                  fontSize={{ base: "3xl", md: "5xl", lg: "5xl" }}
                  fontWeight="900"
                  lineHeight="1.08"
                  color={colors.darkest}
                  letterSpacing="-0.025em"
                >
                  Cook with what
                  <Box as="span" color={colors.primary} display="block">
                    you already have.
                  </Box>
                </Text>

                <Text
                  maxW="540px"
                  color={colors.dark}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.7"
                >
                  Pick the ingredients sitting in your kitchen and MhobFinder
                  instantly shows recipes you can make — no shopping required.
                </Text>

                <HStack gap="3" pt="1" flexWrap="wrap">
                  <Button
                    size="lg"
                    px="8"
                    borderRadius="xl"
                    bg={colors.primary}
                    color="white"
                    fontWeight="700"
                    _hover={{ bg: colors.dark, transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    onClick={() => navigate("/home")}
                  >
                    Get Started
                    <Icon as={FiArrowRight} ml="2" />
                  </Button>
                  <Button
                    size="lg"
                    px="8"
                    borderRadius="xl"
                    variant="outline"
                    borderColor={colors.primary}
                    color={colors.darkest}
                    fontWeight="700"
                    _hover={{ bg: "white", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </HStack>

                {/* Quick stats */}
                <SimpleGrid columns={3} gap="3" pt="3" w="full" maxW="480px">
                  {quickStats.map((s) => (
                    <Box
                      key={s.label}
                      bg="whiteAlpha.900"
                      border="1px solid #CFE0FA"
                      p="3.5"
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Text
                        fontSize="xl"
                        fontWeight="800"
                        color={colors.darkest}
                      >
                        {s.value}
                      </Text>
                      <Text fontSize="xs" color={colors.dark} fontWeight="600">
                        {s.label}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </GridItem>

            {/* Right — Live preview card */}
            <GridItem animation={`${fadeIn} 800ms ease-out`}>
              <Box
                bg="white"
                border="1px solid #C9DAF8"
                borderRadius="2xl"
                p={{ base: 5, md: 7 }}
                boxShadow="0 20px 50px rgba(43,76,126,0.12)"
              >
                {/* Mini header bar */}
                <HStack mb="5" gap="2">
                  <Box w="10px" h="10px" borderRadius="full" bg="#FF6058" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#FFBD2E" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#28CA42" />
                  <Text
                    ml="3"
                    fontSize="xs"
                    fontWeight="700"
                    color={colors.dark}
                  >
                    MhobFinder — Preview
                  </Text>
                </HStack>

                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color={colors.darkest}
                  mb="3"
                >
                  Your ingredients
                </Text>

                <Flex gap="2" flexWrap="wrap" mb="5">
                  {sampleIngredients.map((name) => (
                    <Box
                      key={name}
                      px="3"
                      py="1"
                      borderRadius="full"
                      bg={colors.chipBg}
                      border="1px solid #C7D9FB"
                      color={colors.darkest}
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {name}
                    </Box>
                  ))}
                </Flex>

                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color={colors.darkest}
                  mb="2"
                >
                  Matching recipes
                </Text>

                <VStack align="stretch" gap="2">
                  {sampleRecipes.map((r, idx) => (
                    <HStack
                      key={r.title}
                      p="3"
                      borderRadius="xl"
                      bg={idx === 0 ? "#DDEAFF" : "#F2F6FF"}
                      border="1px solid #CBDBFA"
                      justify="space-between"
                    >
                      <Box>
                        <Text
                          fontWeight="700"
                          fontSize="sm"
                          color={colors.darkest}
                        >
                          {r.title}
                        </Text>
                        <Text fontSize="xs" color={colors.dark}>
                          {r.match}
                        </Text>
                      </Box>
                      {idx === 0 && (
                        <Badge
                          bg={colors.primary}
                          color="white"
                          borderRadius="full"
                          px="2"
                          fontSize="2xs"
                          fontWeight="700"
                        >
                          Best match
                        </Badge>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}
