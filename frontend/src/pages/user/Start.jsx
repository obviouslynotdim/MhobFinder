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
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { colors } from "../../theme/tokens.js";
import { useTranslation } from "../../context/useTranslation.js";
import LanguageSwitcher from "../../components/common/LanguageSwitcher.jsx";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const quickStats = [
  { key: "activeRecipes", value: "100+" },
  { key: "pantryIngredients", value: "150+" },
  { key: "averageSetup", value: "< 30 s" },
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
  const { t } = useTranslation();

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
        px={{ base: 3, md: 10 }}
        py={{ base: 4, md: 5 }}
        align="center"
        justify="space-between"
      >
        <Text
          fontSize={{ base: "lg", md: "3xl", lg: "4xl" }}
          fontWeight="900"
          color={colors.darkest}
          letterSpacing="-0.03em"
        >
          MhobFinder
        </Text>

        <HStack gap={{ base: "2", md: "3" }}>
          <LanguageSwitcher
            iconColor={colors.darkest}
            hoverBg="white"
            compact
            showLabel
          />

          <Button
            size={{ base: "xs", md: "sm" }}
            borderRadius="full"
            variant="outline"
            borderColor={colors.primary}
            color={colors.darkest}
            fontWeight="700"
            _hover={{ bg: "white" }}
            onClick={() => navigate("/login")}
          >
            {t("start.register")}
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
          px={{ base: 3, md: 10 }}
          pt={{ base: 3, md: 6 }}
          pb={{ base: 8, md: 14 }}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
            gap={{ base: 7, md: 12 }}
            alignItems="center"
          >
            {/* Left — Copy */}
            <GridItem animation={`${fadeIn} 600ms ease-out`}>
              <VStack align="start" gap={{ base: "4", md: "6" }}>
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
                  {t("start.badge")}
                </Badge>

                <Text
                  fontSize={{ base: "xl", md: "5xl", lg: "5xl" }}
                  fontWeight="900"
                  lineHeight="1.08"
                  color={colors.darkest}
                  letterSpacing="-0.025em"
                >
                  {t("start.heroLine1")}
                  <Box as="span" color={colors.primary} display="block">
                    {t("start.heroLine2")}
                  </Box>
                </Text>

                <Text
                  maxW="540px"
                  color={colors.dark}
                  fontSize={{ base: "xs", md: "lg" }}
                  lineHeight="1.7"
                >
                  {t("start.subtitle")}
                </Text>

                <HStack gap="2" pt="1" flexWrap="wrap">
                  <Button
                    size={{ base: "sm", md: "lg" }}
                    px={{ base: "6", md: "8" }}
                    borderRadius="xl"
                    bg={colors.primary}
                    color="white"
                    fontWeight="700"
                    _hover={{ bg: colors.dark, transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    onClick={() => navigate("/home")}
                  >
                    {t("start.getStarted")}
                    <Icon as={FiArrowRight} ml="2" />
                  </Button>
                  <Button
                    size={{ base: "sm", md: "lg" }}
                    px={{ base: "6", md: "8" }}
                    borderRadius="xl"
                    variant="outline"
                    borderColor={colors.primary}
                    color={colors.darkest}
                    fontWeight="700"
                    _hover={{ bg: "white", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    onClick={() => navigate("/login")}
                  >
                    {t("start.login")}
                  </Button>
                </HStack>

                {/* Quick stats */}
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  gap={{ base: "2", md: "3" }}
                  pt={{ base: "2", md: "3" }}
                  w="full"
                  maxW="480px"
                >
                  {quickStats.map((s) => (
                    <Box
                      key={s.key}
                      bg="whiteAlpha.900"
                      border="1px solid #CFE0FA"
                      p={{ base: "2.5", md: "3.5" }}
                      borderRadius="xl"
                      textAlign="center"
                    >
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="800"
                        color={colors.darkest}
                      >
                        {s.value}
                      </Text>
                      <Text fontSize="xs" color={colors.dark} fontWeight="600">
                        {t(`start.quickStats.${s.key}`)}
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
                p={{ base: 4, md: 7 }}
                boxShadow="0 20px 50px rgba(43,76,126,0.12)"
              >
                {/* Mini header bar */}
                <HStack mb={{ base: "4", md: "5" }} gap="2">
                  <Box w="10px" h="10px" borderRadius="full" bg="#FF6058" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#FFBD2E" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#28CA42" />
                  <Text
                    ml="3"
                    fontSize="xs"
                    fontWeight="700"
                    color={colors.dark}
                  >
                    {t("start.previewTitle")}
                  </Text>
                </HStack>

                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="700"
                  color={colors.darkest}
                  mb="3"
                >
                  {t("start.yourIngredients")}
                </Text>

                <Flex gap={{ base: "1.5", md: "2" }} flexWrap="wrap" mb={{ base: "4", md: "5" }}>
                  {sampleIngredients.map((name) => (
                    <Box
                      key={name}
                      px="3"
                      py="1"
                      borderRadius="full"
                      bg={colors.chipBg}
                      border="1px solid #C7D9FB"
                      color={colors.darkest}
                      fontSize={{ base: "10px", md: "xs" }}
                      fontWeight="600"
                    >
                      {name}
                    </Box>
                  ))}
                </Flex>

                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="700"
                  color={colors.darkest}
                  mb="2"
                >
                  {t("start.matchingRecipes")}
                </Text>

                <VStack align="stretch" gap="2">
                  {sampleRecipes.map((r, idx) => (
                    <HStack
                      key={r.title}
                      p={{ base: "2.5", md: "3" }}
                      borderRadius="xl"
                      bg={idx === 0 ? "#DDEAFF" : "#F2F6FF"}
                      border="1px solid #CBDBFA"
                      justify="space-between"
                    >
                      <Box>
                        <Text
                          fontWeight="700"
                          fontSize={{ base: "xs", md: "sm" }}
                          color={colors.darkest}
                        >
                          {r.title}
                        </Text>
                        <Text fontSize={{ base: "10px", md: "xs" }} color={colors.dark}>
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
                          {t("start.bestMatch")}
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
