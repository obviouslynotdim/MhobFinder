import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHeart, FiUser, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { useUser } from "../context/UserProvider.jsx";
import { MdTranslate } from "react-icons/md";

export default function TopBarRight() {
  const { search, setSearch } = useApp();
  const { user } = useUser();
  const nav = useNavigate();
  const loc = useLocation();
  const isFavoritesPage = loc.pathname === "/favorites";
  const isProfilePage = loc.pathname === "/profile";
  const activeNavBg = "whiteAlpha.200";
  const useCustomTitle = isFavoritesPage || isProfilePage;

  return (
    <VStack w="full" gap="4" align="stretch">
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
      <InputGroup w="full" startElement={<FiSearch size="18" color="#718096" />}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find..."
          bg="white"
          borderRadius="md"
          h="40px"
        />
      </InputGroup>
    </VStack>
  );
}
