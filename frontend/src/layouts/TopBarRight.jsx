import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHeart, FiUser, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { useUser } from "../context/UserProvider.jsx";
import { MdTranslate } from "react-icons/md";

function getAdminTitle(pathname) {
  if (pathname.includes("/admin/manage-user")) return "User Management";
  if (pathname.includes("/admin/analytical")) return "Analytics";
  if (pathname.includes("/admin/add-food")) return "Add Food";
  if (pathname.includes("/admin/edit-food")) return "Edit Food";
  if (pathname.includes("/admin/foods")) return "Food Library";
  return "Admin Dashboard";
}

export default function TopBarRight() {
  const { search, setSearch } = useApp();
  const { user } = useUser();
  const nav = useNavigate();
  const loc = useLocation();
  const isAdminPage = loc.pathname.startsWith("/admin");
  const isFavoritesPage = loc.pathname === "/favorites";
  const isProfilePage = loc.pathname === "/profile";
  const activeNavBg = "whiteAlpha.200";
  const useCustomTitle = isFavoritesPage || isProfilePage;

  if (isAdminPage) {
    return (
      <HStack w="full" justify="space-between" gap={{ base: 3, md: 5 }}>
        <Box minW="fit-content">
          <Text fontWeight="800" color="white" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.1">
            {getAdminTitle(loc.pathname)}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800" mt={0.5}>
            MhobFinder Admin
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
            placeholder="Search recipes or users"
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

          <IconButton
            aria-label="Translations"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <MdTranslate />
          </IconButton>
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
              {isFavoritesPage ? "Favorite Page" : "Profile Page"}
            </Text>
          </HStack>
        ) : (
          <Text fontWeight="bold" color="white" fontSize="2xl" letterSpacing="wider" onClick={() => nav("/home")} cursor="pointer">
            MhobFinder
          </Text>
        )}

        <HStack>
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
            bg={isProfilePage ? activeNavBg : "transparent"}
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => {
              if (!isProfilePage) nav("/profile");
            }}
          >
            <FiUser />
          </IconButton>

          <IconButton
            aria-label="Translations"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <MdTranslate />
          </IconButton>
        </HStack>
      </HStack>

      {/* Row 2: Search bar */}
      <InputGroup w="full" mt="4" startElement={<FiSearch size="18" color="#718096" />}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find..."
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
