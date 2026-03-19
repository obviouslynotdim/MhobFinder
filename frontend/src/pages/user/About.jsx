import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiArrowUpRight, FiGlobe, FiGithub } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "../../context/useTranslation.js";
import { colors } from "../../theme/tokens.js";
import nakImage from "../../assets/members/nak.png";
import davinImage from "../../assets/members/davin.png";
import kimhongImage from "../../assets/members/kimhong.png";
import vanndaImage from "../../assets/members/vannda.png";
// import sakImage from "../../assets/members/chytasenasak.png";
import virakImage from "../../assets/members/virak.png";    
import featureImageOne from "../../assets/feature/mhohfinder.jpg";
import featureImageTwo from "../../assets/feature/mhobfinder2.jpg";
import featureImageThree from "../../assets/feature/mhobfinder3.jpg";

const MEMBERS = [
  {
    name: "Sao Sethavathanak",
    role: "Full Stack Developer / Team Lead",
    image: nakImage,
    website: "https://sethavathanak-portfolio.vercel.app/",
    github: "https://github.com/obviouslynotdim",
  },
  {
    name: "Pov Davin",
    role: "Backend Developer / API Integration",
    image: davinImage,
    website: "https://example.com",
    github: "https://github.com/Jer1ckk",
  },
  {
    name: "Kimhong Chhour",
    role: "Frontend Developer",
    image: kimhongImage,
    website: "https://example.com",
    github: "https://github.com/jin-kimhong646",
  },
  {
    name: "Khorn Vannda",
    role: "Database",
    image: vanndaImage,
    website: "https://example.com",
    github: "https://github.com/kingvaxxda3103",
  },
  {
    name: "Mok Chytasenasak",
    role: "Frontend",
    image: '',
    website: "https://example.com",
    github: "https://github.com/Sakk-pk",
  },
  {
    name: "Luy Virak",
    role: "Frontend",
    image: virakImage,
    website: "https://example.com",
    github: "https://github.com/luy-virak",
  },
];

const FEATURE_PLACEHOLDERS = [
  {
    titleKey: "about.features.smartMatching",
    image: featureImageOne,
  },
  {
    titleKey: "about.features.recipeDetails",
    image: featureImageTwo,
  },
  {
    titleKey: "about.features.multiLanguage",
    image: featureImageThree,
  },
];

function FadeInCard({ children, delay = 0, ...props }) {
  return (
    <Box
      animation="fadeSlideIn 0.55s ease both"
      animationDelay={`${delay}ms`}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-3px)", boxShadow: "0 14px 26px rgba(31,61,102,0.14)" }}
      {...props}
    >
      {children}
    </Box>
  );
}

function MemberCard({ member, delay }) {
  return (
    <FadeInCard
      delay={delay}
      bg="white"
      border="1.5px solid"
      borderColor="#D4E3F8"
      borderRadius="3xl"
      p={{ base: 5, md: 6 }}
      boxShadow="0 10px 22px rgba(31,61,102,0.10)"
      minH={{ base: "auto", md: "300px" }}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 16px 28px rgba(31,61,102,0.18)",
      }}
    >
      <VStack align="center" justify="center" textAlign="center" gap="4" h="100%">
        <Avatar.Root
          size="2xl"
          border="2px solid"
          borderColor={colors.primary}
          boxShadow="0 8px 18px rgba(31,61,102,0.16)"
          style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', borderRadius: '50%' }}
        >
            {member.image ? <Avatar.Image src={member.image} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%' }} /> : null}
            <Avatar.Fallback name={member.name} bg={colors.chipBg} color={colors.darkest} />
        </Avatar.Root>

        <Box>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="800"
            color={colors.darkest}
            lineHeight="1.35"
            maxW="260px"
          >
            {member.name}
          </Text>
          <Text
            mt="1"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="700"
            color={colors.primary}
            lineHeight="1.45"
            maxW="260px"
          >
            {member.role}
          </Text>
        </Box>

        <HStack gap="4" pt="1">
          <Link
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            color={colors.dark}
            _hover={{ color: colors.primary, transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
            aria-label={`${member.name} website`}
          >
            <FiGlobe size={22} />
          </Link>

          <Link
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            color={colors.dark}
            _hover={{ color: colors.primary, transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
            aria-label={`${member.name} github`}
          >
            <FiGithub size={22} />
          </Link>
        </HStack>
      </VStack>
    </FadeInCard>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <Box
      p={{ base: 4, md: 6 }}
      sx={{
        "@keyframes fadeSlideIn": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box maxW="1120px" mx="auto" w="full">
        <FadeInCard
          delay={30}
          id="overview"
          border="1px solid"
          borderColor="#CFE0FA"
          borderRadius="2xl"
          bg="linear-gradient(135deg, #F8FBFF 0%, #EDF4FF 60%, #E5EFFF 100%)"
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
          boxShadow="0 12px 28px rgba(43,76,126,0.1)"
          _hover={{ transform: "none", boxShadow: "0 12px 28px rgba(43,76,126,0.1)" }}
        >
          <VStack align="start" gap="3" maxW="780px">
            <Badge bg={colors.primary} color="white" px="3" py="1" borderRadius="full">
              {t("about.badge")}
            </Badge>
            <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800" color={colors.darkest} lineHeight="1.15">
              {t("about.heroTitle")}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color={colors.dark} lineHeight="1.85">
              {t("about.heroDescription")}
            </Text>

            <HStack gap="3" pt="2" wrap="wrap">
              <Button
                as={RouterLink}
                to="/home"
                bg={colors.primary}
                color="white"
                _hover={{ bg: colors.dark }}
                rightIcon={<FiArrowUpRight />}
              >
                {t("about.tryApp")}
              </Button>
              <Button
                as="a"
                href="#features"
                variant="outline"
                borderColor="#BFD3F3"
                color={colors.dark}
                _hover={{ bg: colors.chipBg }}
              >
                {t("about.viewFeatures")}
              </Button>
            </HStack>
          </VStack>
        </FadeInCard>

        <Box id="features" mt="7">
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" color={colors.darkest}>
            {t("about.featureTitle")}
          </Text>
          <Text fontSize="sm" color={colors.dark} mt="1">
            {t("about.featureDescription")}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="4">
            {FEATURE_PLACEHOLDERS.map((item, index) => (
              <FadeInCard
                key={`${item.titleKey}-${index}`}
                delay={220 + index * 70}
                border="1px solid"
                borderColor="#CFE0FA"
                borderRadius="xl"
                bg="white"
                overflow="hidden"
                p="0"
                minH="180px"
                _hover={{
                  transform: "translateY(-2px)",
                  borderColor: colors.primary,
                  boxShadow: "0 10px 20px rgba(31,61,102,0.08)",
                }}
              >
                <Box position="relative">
                  <Image src={item.image} alt={t(item.titleKey)} w="100%" h="190px" objectFit="cover" />
                  <Box
                    position="absolute"
                    left="0"
                    right="0"
                    bottom="0"
                    px="3"
                    py="2.5"
                    bg="linear-gradient(180deg, rgba(31,61,102,0.02) 0%, rgba(31,61,102,0.78) 100%)"
                  >
                    <Text fontSize="sm" color="white" fontWeight="700" lineHeight="1.4">
                      {t(item.titleKey)}
                    </Text>
                  </Box>
                </Box>
              </FadeInCard>
            ))}
          </SimpleGrid>
        </Box>

        <Box id="team" mt="7">
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" color={colors.darkest}>
            {t("about.teamTitle")}
          </Text>
          <Text fontSize="sm" color={colors.dark} mt="1">
            {t("about.teamDescription")}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={{ base: 4, md: 5 }} mt="4">
            {MEMBERS.map((member, index) => (
              <MemberCard key={member.name} member={member} delay={100 + index * 80} />
            ))}
          </SimpleGrid>
        </Box>

        <Box id="footer" mt="8" pt="5" borderTop="1px solid" borderColor="#D9E6F8">
          <HStack justify="space-between" wrap="wrap" gap="2">
            <Text fontSize="sm" color="gray.600">
              {t("about.footer.copyright", { year: new Date().getFullYear() })}
            </Text>
            <HStack gap="3">
              <Link href="/about" fontSize="sm" color={colors.dark} _hover={{ color: colors.primary }}>
                {t("about.footer.about")}
              </Link>
              <Link href="/home" fontSize="sm" color={colors.dark} _hover={{ color: colors.primary }}>
                {t("about.footer.home")}
              </Link>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
