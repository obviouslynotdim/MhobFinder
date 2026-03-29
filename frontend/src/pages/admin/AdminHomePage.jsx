import { Box, Text, VStack, HStack, SimpleGrid, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiGrid, FiUsers, FiFlag, FiPlus } from "react-icons/fi";
import { colors } from "../../theme/tokens.js";
import { getAllFoods } from "../../services/api/food.service.js";
import { fetchAllUsers } from "../../services/api/user.service.js";
import { createElement, useEffect, useState } from "react";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [foods, users] = await Promise.all([
          getAllFoods(),
          fetchAllUsers(),
        ]);
        setStats({
          totalFoods: Array.isArray(foods) ? foods.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const StatCard = ({ icon, title, value, description, action, actionLabel }) => (
    <Box
      bg="white"
      border="1px solid"
      borderColor="#dbe5f4"
      borderRadius="16px"
      p={{ base: 5, md: 6 }}
      _hover={{ boxShadow: "0 4px 12px rgba(79,121,189,0.1)", borderColor: colors.primary }}
      transition="all 0.2s ease"
    >
      <HStack mb={4} justify="space-between">
        <Box
          bg="#edf4ff"
          borderRadius="12px"
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {createElement(icon, { size: 24, color: colors.primary })}
        </Box>
      </HStack>
      <Text fontWeight="600" color={colors.darkest} fontSize="sm" mb={1}>
        {title}
      </Text>
      <Text fontSize="2xl" fontWeight="800" color={colors.primary} mb={2}>
        {loading ? "—" : value}
      </Text>
      <Text color="gray.500" fontSize="xs" mb={4}>
        {description}
      </Text>
      {action && (
        <Button
          size="sm"
          bg="#edf4ff"
          color={colors.primary}
          borderRadius="full"
          rightIcon={<FiArrowRight size={14} />}
          onClick={action}
          _hover={{ bg: colors.chipHover }}
          w="100%"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );

  const ActionCard = ({ icon, title, description, onClick }) => (
    <Box
      bg="white"
      border="1px solid"
      borderColor="#dbe5f4"
      borderRadius="16px"
      p={{ base: 5, md: 6 }}
      cursor="pointer"
      _hover={{ boxShadow: "0 4px 12px rgba(79,121,189,0.1)", borderColor: colors.primary, transform: "translateY(-2px)" }}
      transition="all 0.2s ease"
      onClick={onClick}
    >
      <Box
        bg={colors.primary}
        borderRadius="12px"
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        {createElement(icon, { size: 24, color: "white" })}
      </Box>
      <Text fontWeight="600" color={colors.darkest} fontSize="md" mb={1}>
        {title}
      </Text>
      <Text color="gray.500" fontSize="sm">
        {description}
      </Text>
    </Box>
  );

  return (
    <Box h="100%" minH={0} overflow="auto" overflowX="hidden" pr={1}>
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 6 }}
        minH="100%"
      >
        {/* Header */}
        <VStack align="stretch" spacing={2} mb={8}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
            Admin Dashboard
          </Text>
          <Text color="gray.600">
            Overview of your food library, users, and system statistics.
          </Text>
        </VStack>

        {/* Stats Grid */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 2 }}
          gap={{ base: 6, md: 8 }}
          px={{ base: 0, md: 1 }}
          mb={10}
        >
          <StatCard
            icon={FiGrid}
            title="Total Recipes"
            value={stats.totalFoods}
            description="Food items in your library"
            action={() => navigate("/admin/foods")}
            actionLabel="View All"
          />
          <StatCard
            icon={FiUsers}
            title="Users"
            value={stats.totalUsers}
            description="Registered accounts"
            action={() => navigate("/admin/manage-user")}
            actionLabel="Manage"
          />
        </SimpleGrid>

        {/* Quick Actions */}
        <Box mb={10}>
          <Text fontWeight="700" color={colors.darkest} fontSize="lg" mb={4}>
            Quick Actions
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            gap={{ base: 6, md: 8 }}
            px={{ base: 0, md: 1 }}
          >
            <ActionCard
              icon={FiPlus}
              title="Add Food"
              description="Create a new recipe"
              onClick={() => navigate("/admin/add-food")}
            />
            <ActionCard
              icon={FiUsers}
              title="Users"
              description="Monitor user accounts"
              onClick={() => navigate("/admin/manage-user")}
            />
            <ActionCard
              icon={FiFlag}
              title="Bug Reports"
              description="Review user reports"
              onClick={() => navigate("/admin/bug-reports")}
            />
          </SimpleGrid>
        </Box>

        {/* Additional Info */}
        <Box bg="#fbfdff" border="1px solid" borderColor="#dbe5f4" borderRadius="16px" p={6}>
          <Text fontWeight="700" color={colors.darkest} fontSize="lg" mb={3}>
            Welcome to Food Library Admin
          </Text>
          <VStack align="start" spacing={2} color="gray.600" fontSize="sm">
            <Text>• Manage all recipes and user accounts</Text>
            <Text>• Monitor system health and user activity</Text>
            <Text>• Review bug reports and user feedback</Text>
            <Text>• Analyze library statistics and trends</Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
