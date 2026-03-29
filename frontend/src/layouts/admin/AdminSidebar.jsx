import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiHeart,
  FiGrid,
  FiPlusSquare,
  FiUsers,
  FiBarChart2,
  FiFlag,
  FiLayers,
} from "react-icons/fi";
import { colors } from "../../theme/tokens.js";

export default function AdminSidebar({ expanded, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: FiHome, label: "Home", path: "/admin/home", key: "home" },
    { icon: FiHeart, label: "Favorite", path: "/admin/favorites", key: "favorites" },
    { icon: FiGrid, label: "All Food", path: "/admin/foods", key: "foods" },
    { icon: FiPlusSquare, label: "Add Food", path: "/admin/add-food", key: "add-food" },
    { icon: FiLayers, label: "Ingredients", path: "/admin/ingredients", key: "ingredients" },
    { icon: FiUsers, label: "Manage User", path: "/admin/manage-user", key: "manage-user" },
    { icon: FiFlag, label: "Bug Reports", path: "/admin/bug-reports", key: "bug-reports" },
    { icon: FiBarChart2, label: "Analytical", path: "/admin/analytical", key: "analytical" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Box
      w={expanded ? { base: "220px", md: "260px" } : { base: "70px", md: "78px" }}
      bg={colors.primary}
      borderRight="1px solid rgba(255,255,255,0.18)"
      display="flex"
      flexDirection="column"
      py={5}
      gap={6}
      flexShrink={0}
      overflow="hidden"
      transition="width 0.25s ease"
      h="100vh"
    >
      {/* Menu toggle */}
      <Flex justify={expanded ? "flex-start" : "center"} px={{ base: 2, md: 4 }}>
        <Box
          as="button"
          type="button"
          onClick={onToggle}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w={{ base: "44px", md: "48px" }}
          h={{ base: "44px", md: "48px" }}
          borderRadius="12px"
          bg="transparent"
          _hover={{ bg: "whiteAlpha.300" }}
          transition="background 0.2s ease"
        >
          <Icon as={FiMenu} boxSize={8} color="white" strokeWidth={2.5} />
        </Box>
      </Flex>

      {/* Sidebar items */}
      <VStack gap={3} mt={2} align="stretch" px={expanded ? { base: 2, md: 3 } : 0}>
        {items.map((item) => (
          <Flex
            key={item.key}
            onClick={() => navigate(item.path)}
            align="center"
            justify={expanded ? "flex-start" : "center"}
            gap={{ base: 3, md: 4 }}
            h="50px"
            px={expanded ? 4 : 0}
            mx={expanded ? 0 : 2}
            borderRadius="14px"
            bg={isActive(item.path) ? "rgba(255,255,255,0.20)" : "transparent"}
            border={isActive(item.path) ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent"}
            cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.14)" }}
            transition="background 0.2s ease, border-color 0.2s ease"
          >
            <Icon
              as={item.icon}
              color="white"
              boxSize={6}
              strokeWidth={2.5}
              flexShrink={0}
            />

            {expanded && (
              <Text color="white" fontWeight="600" whiteSpace="nowrap">
                {item.label}
              </Text>
            )}
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}
