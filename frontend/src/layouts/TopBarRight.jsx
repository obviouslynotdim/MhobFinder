import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHeart, FiUser, FiSearch, FiEdit2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { useUser } from "../context/UserProvider.jsx";
import { useTranslation } from "../context/useTranslation.js";
import LanguageSwitcher from "../components/common/LanguageSwitcher.jsx";

function getAdminTitle(pathname, t) {
  if (pathname.includes("/admin/manage-user")) return t("topBar.adminTitles.manageUser");
  if (pathname.includes("/admin/analytical")) return t("topBar.adminTitles.analytical");
  if (pathname.includes("/admin/add-food")) return t("topBar.adminTitles.addFood");
  if (pathname.includes("/admin/edit-food")) return t("topBar.adminTitles.editFood");
  if (pathname.includes("/admin/foods")) return t("topBar.adminTitles.foods");
  return t("topBar.adminTitles.default");
}

function getUserDisplayName(user) {
  if (!user) return "";

  const source = String(user.name || user.email || "").trim();
  if (!source) return "User";

  const firstSegment = source.split(/[\s@]+/)[0] || source;
  return firstSegment.length > 14
    ? `${firstSegment.slice(0, 14)}...`
    : firstSegment;
}

export default function TopBarRight() {
  const { search, setSearch } = useApp();
  const { user, loading } = useUser();
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
  const isLoggedIn = Boolean(user);
  const authStatus = loading
    ? t("topBar.auth.checking")
    : isLoggedIn
      ? t("topBar.auth.loggedInAs", { name: getUserDisplayName(user) })
      : t("topBar.auth.guest");
  const authDotColor = loading ? "yellow.300" : isLoggedIn ? "green.300" : "orange.300";

  const authChip = (
    <HStack
      gap="1.5"
      maxW={{ base: "140px", md: "220px" }}
      title={authStatus}
    >
      <Box
        flexShrink={0}
        w="8px"
        h="8px"
        borderRadius="full"
        bg={authDotColor}
      />
      <Text
        color="white"
        fontSize={{ base: "2xs", md: "xs" }}
        fontWeight="700"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {authStatus}
      </Text>
    </HStack>
  );

  if (isAdminPage) {
    return (
      <HStack w="full" justify="space-between" gap={{ base: 3, md: 5 }}>
        <Box minW="fit-content">
          <Text fontWeight="800" color="white" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.1">
            {getAdminTitle(loc.pathname, t)}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800" mt={0.5}>
            {t("topBar.adminBrand")}
          </Text>
        </Box>

        <InputGroup
          flex="1"
          maxW="460px"
          startElement={<FiSearch size="18" color="#718096" />}
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
          {authChip}

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
      <HStack w="full" justify="space-between">
        {useCustomTitle ? (
          <HStack gap="2">
            <IconButton
              aria-label="Back to home"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => nav("/home")}
            >
              <FiArrowLeft />
            </IconButton>
            <Text fontWeight="bold" color="white" fontSize="2xl">
              {isFavoritesPage ? t("topBar.favoritesPage") : t("topBar.profilePage")}
            </Text>
          </HStack>
        ) : (
          <Text fontWeight="bold" color="white" fontSize="2xl" letterSpacing="wider" onClick={() => nav("/home")} cursor="pointer">
            MhobFinder
          </Text>
        )}

        <HStack gap={2}>
          {authChip}

          {user && (
            <IconButton
              aria-label="Favorites"
              variant="ghost"
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
            color="white"
            bg={isProfileSection ? activeNavBg : "transparent"}
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => {
              if (!isProfileSection) nav("/profile");
            }}
          >
            <FiUser />
          </IconButton>

          {isProfilePage && (
            <IconButton
              aria-label="Edit profile"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => nav("/profile/edit")}
            >
              <FiEdit2 />
            </IconButton>
          )}

          <LanguageSwitcher iconColor="white" hoverBg="whiteAlpha.200" />
        </HStack>
      </HStack>

      {/* Row 2: Search bar */}
      <InputGroup w="full" mt="4" startElement={<FiSearch size="18" color="#718096" />}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.searchPlaceholder")}
          bg="white"
          color="gray.700"
          _placeholder={{ color: "gray.500" }}
          borderRadius="md"
          h="40px"
        />
      </InputGroup>
    </Box>
  );
}
