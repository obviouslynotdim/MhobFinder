import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHeart, FiUser, FiSearch, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { useUser } from "../context/UserProvider.jsx";
import { useTranslation } from "../context/useTranslation.js";
import { getAdminTitleKey } from "../i18n/translations.js";
import LanguageSwitcher from "../components/common/LanguageSwitcher.jsx";



export default function TopBarRight() {
  const { search, setSearch } = useApp();
  const { user } = useUser();
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();
  const isAdminPage = loc.pathname.startsWith("/admin");
  const isFavoritesPage = loc.pathname === "/favorites";
  const isProfilePage = loc.pathname === "/profile";
  const isEditProfilePage = loc.pathname === "/profile/edit";
  const isProfileSection = isProfilePage || isEditProfilePage;
  const activeNavBg = "whiteAlpha.200";
  const useCustomTitle = isFavoritesPage || isProfileSection;

  if (isAdminPage) {
    return (
      <HStack w="full" justify="space-between" gap={{ base: 3, md: 5 }}>
        <Box minW="fit-content">
          <Text fontWeight="800" color="white" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.1">
            {t(`topBar.adminTitles.${getAdminTitleKey(loc.pathname)}`)}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800" mt={0.5}>
            {t("topBar.adminBrand")}
          </Text>
        </Box>

        <InputGroup
          flex="1"
          maxW="460px"
          startElement={<FiSearch size="18" color="#718096" />}
          endElement={
            search ? (
              <IconButton
                aria-label="Clear search"
                variant="ghost"
                size="xs"
                color="gray.500"
                _hover={{ bg: "gray.100", color: "gray.700" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setSearch("")}
              >
                <FiX />
              </IconButton>
            ) : null
          }
          display={{ base: "none", md: "flex" }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("topBar.searchRecipesOrUsers")}
            bg="white"
            color="gray.700"
            _placeholder={{ color: "gray.500" }}
            borderRadius="full"
            h="42px"
            border="none"
            boxShadow="sm"
          />
        </InputGroup>

        <HStack gap={1}>
          <IconButton
            aria-label="Profile"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => nav("/profile")}
          >
            <FiUser />
          </IconButton>

          <LanguageSwitcher iconColor="white" hoverBg="whiteAlpha.200" />
        </HStack>
      </HStack>
    );
  }

  return (
    <Box w="full">
      {/* Row 1: Route-aware title and actions */}
      <HStack w="full" justify="space-between" gap={{ base: "1", md: "2" }}>
        {useCustomTitle ? (
          <HStack gap={{ base: "1", md: "2" }} minW="0" flex="1">
            <IconButton
              aria-label="Back to home"
              variant="ghost"
              size={{ base: "sm", md: "md" }}
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => nav("/home")}
            >
              <FiArrowLeft />
            </IconButton>
            <Text
              fontWeight="bold"
              color="white"
              fontSize={{ base: "md", md: "2xl" }}
              noOfLines={1}
            >
              {isFavoritesPage ? t("topBar.favoritesPage") : t("topBar.profilePage")}
            </Text>
          </HStack>
        ) : (
          <Text
            fontWeight="bold"
            color="white"
            fontSize={{ base: "lg", md: "2xl" }}
            letterSpacing={{ base: "normal", md: "wider" }}
            onClick={() => nav("/home")}
            cursor="pointer"
          >
            MhobFinder
          </Text>
        )}

        <HStack gap={{ base: 1, md: 2 }} flexShrink={0}>
          {user && (
            <IconButton
              aria-label="Favorites"
              variant="ghost"
              size={{ base: "sm", md: "md" }}
              color="white"
              bg={isFavoritesPage ? activeNavBg : "transparent"}
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => {
                if (!isFavoritesPage) nav("/favorites");
              }}
            >
              <FiHeart />
            </IconButton>
          )}

          <IconButton
            aria-label="User"
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            color="white"
            bg={isProfileSection ? activeNavBg : "transparent"}
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => {
              if (!isProfileSection) nav("/profile");
            }}
          >
            <FiUser />
          </IconButton>

          <LanguageSwitcher iconColor="white" hoverBg="whiteAlpha.200" />
        </HStack>
      </HStack>

      {/* Row 2: Search bar */}
      <InputGroup
        w="full"
        mt={{ base: "3", md: "4" }}
        startElement={<FiSearch size="18" color="#718096" />}
        endElement={
          search ? (
            <IconButton
              aria-label="Clear search"
              variant="ghost"
              size="xs"
              color="gray.500"
              _hover={{ bg: "gray.100", color: "gray.700" }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSearch("")}
            >
              <FiX />
            </IconButton>
          ) : null
        }
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.searchPlaceholder")}
          bg="white"
          color="gray.700"
          _placeholder={{ color: "gray.500" }}
          borderRadius="md"
          h={{ base: "36px", md: "40px" }}
          fontSize={{ base: "sm", md: "md" }}
        />
      </InputGroup>
    </Box>
  );
}
