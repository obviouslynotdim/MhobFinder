import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiHeart, FiUser, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { useUser } from "../context/UserProvider.jsx";
import { MdTranslate } from "react-icons/md";

export default function TopBarRight() {
  const { search, setSearch } = useApp();
  const { user } = useUser();
  const nav = useNavigate();

  return (
    <VStack w="full" gap="4" align="stretch">
      {/* Row 1: MhobFinder centered, icons pinned to the right */}
      <HStack w="full" position="relative" justify="center">
        <Text fontWeight="bold" color="white" fontSize="2xl" letterSpacing="wider" onClick={() => nav("/home")} cursor="pointer">
          MhobFinder
        </Text>

        <HStack position="absolute" right="0">
          {user && (
            <IconButton
              aria-label="Favorites"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => nav("/favorites")}
            >
              <FiHeart />
            </IconButton>
          )}

          <IconButton
            aria-label="User"
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
