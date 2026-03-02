import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { FiHeart, FiUser, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider.jsx";
import { MdTranslate } from "react-icons/md";

// function pageTitle(pathname) {
//   if (pathname === "/") return "Home";
//   if (pathname.startsWith("/favorites")) return "Favorites";
//   if (pathname.startsWith("/about")) return "About Us";
//   return "";
// }

export default function TopBarRight() {
  const { search, setSearch } = useApp();
  // const loc = useLocation();
  const nav = useNavigate();

  return (
    <HStack w="full" justify="space-between" gap="4">
      <Text fontWeight="bold" color="white" fontSize="lg" minW="110px">
        <Button
          fontSize="lg"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => nav("/about")}
        >
          ABOUT US
        </Button>
      </Text>

      <InputGroup
        flex="1"
        maxW="1200px"
        startElement={<FiSearch size="18" color="#718096" />}
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find..."
          bg="white"
          borderRadius="md"
        />
      </InputGroup>

      <HStack>
        <IconButton
          aria-label="Favorites"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => nav("/favorites")}
        >
          <FiHeart />
        </IconButton>

        <IconButton
          aria-label="User"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => nav("/favorites")}
        >
          <FiUser />
        </IconButton>

        <IconButton
          aria-label="translations"
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
