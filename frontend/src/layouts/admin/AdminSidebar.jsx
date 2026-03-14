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
} from "react-icons/fi";

export default function AdminSidebar({ expanded, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: FiHome, label: "Home", path: "/admin/home", key: "home" },
    { icon: FiHeart, label: "Favorite", path: "/admin/favorites", key: "favorites" },
    { icon: FiGrid, label: "All Food", path: "/admin/foods", key: "foods" },
    { icon: FiPlusSquare, label: "Add Food", path: "/admin/add-food", key: "add-food" },
    { icon: FiUsers, label: "Manage User", path: "/admin/manage-user", key: "manage-user" },
    { icon: FiBarChart2, label: "Analytical", path: "/admin/analytical", key: "analytical" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Box
      w={expanded ? "260px" : "78px"}
      bg="#4f79bd"
      borderRight="3px solid #d2d8e2"
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
      <Flex justify={expanded ? "flex-start" : "center"} px={4}>
        <Box
          as="button"
          type="button"
          onClick={onToggle}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="48px"
          h="48px"
          borderRadius="12px"
          bg="transparent"
          _hover={{ bg: "whiteAlpha.300" }}
          transition="background 0.2s ease"
        >
          <Icon as={FiMenu} boxSize={8} color="white" strokeWidth={2.5} />
        </Box>
      </Flex>

      {/* Sidebar items */}
      <VStack gap={3} mt={2} align="stretch" px={expanded ? 3 : 0}>
        {items.map((item) => (
          <Flex
            key={item.key}
            onClick={() => navigate(item.path)}
            align="center"
            justify={expanded ? "flex-start" : "center"}
            gap={4}
            h="48px"
            px={expanded ? 4 : 0}
            borderRadius="12px"
            bg={isActive(item.path) ? "whiteAlpha.300" : "transparent"}
            cursor="pointer"
            _hover={{ bg: "whiteAlpha.300" }}
            transition="background 0.2s ease"
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
