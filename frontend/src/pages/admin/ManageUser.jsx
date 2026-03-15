import { useMemo, useState, useEffect } from "react";
import { Badge, Box, Flex, HStack, Separator, Spinner, Text } from "@chakra-ui/react";
import ManageUserHeader from "../../components/admin/manageUser/ManageUserHeader";
import UserTable from "../../components/admin/manageUser/UserTable";
import UserCommentsPanel from "../../components/admin/manageUser/UserCommentsPanel";
import { fetchAllUsers, deleteUser } from "../../services/api/user.service";
import { getAllFoods } from "../../services/api/food.service";
import { deleteComment, getCommentsByFood } from "../../services/api/comment.service";

export default function ManageUser() {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderationUser, setModerationUser] = useState(null);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationGroups, setModerationGroups] = useState([]);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    let didCancel = false;
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        if (!didCancel) setUsers(data);
      } catch (err) {
        if (!didCancel) setUsers([]);
      } finally {
        if (!didCancel) setLoading(false);
      }
    }
    loadUsers();
    return () => {
      didCancel = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return users;

    return users.filter((user) => {
      const name = String(user.name || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [users, search]);

  const totalUsers = users.length;
  const filteredCount = filteredUsers.length;

  const loadUserComments = async (user) => {
    setModerationLoading(true);
    setModerationUser(user);
    setModerationGroups([]);

    try {
      const foods = await getAllFoods();
      const foodList = Array.isArray(foods) ? foods : [];

      const commentResults = await Promise.all(
        foodList.map(async (food) => {
          try {
            const comments = await getCommentsByFood(food.food_id);
            const list = Array.isArray(comments) ? comments : [];

            const matchingComments = list
              .filter((comment) => {
                const commentUserId = comment.user_id || comment.user?.user_id;
                return Number(commentUserId) === Number(user.user_id);
              })
              .sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
              );

            if (!matchingComments.length) {
              return null;
            }

            return {
              foodId: food.food_id,
              foodTitle: food.title || `Food #${food.food_id}`,
              comments: matchingComments,
            };
          } catch {
            return null;
          }
        }),
      );

      const groups = commentResults
        .filter(Boolean)
        .sort((a, b) => b.comments.length - a.comments.length);

      setModerationGroups(groups);
    } catch (error) {
      setModerationGroups([]);
    } finally {
      setModerationLoading(false);
    }
  };

  const handleDeleteComment = async (foodId, commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setModerationGroups((prevGroups) =>
        prevGroups
          .map((group) => {
            if (group.foodId !== foodId) return group;
            return {
              ...group,
              comments: group.comments.filter((comment) => comment.comment_id !== commentId),
            };
          })
          .filter((group) => group.comments.length > 0),
      );
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete comment";
      alert(message);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Delete this user and related data?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteUser(userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== userId),
      );
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex h="calc(100vh - 90px - 48px)" justify="center" align="center" direction="column" gap={3}>
        <Spinner color="#4f79bd" size="lg" />
        <Text color="gray.600">Loading users...</Text>
      </Flex>
    );
  }

  return (
    <Box h="calc(100vh - 90px - 48px)" overflow="auto" pr={1}>
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.880"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 7 }}
        minH="100%"
      >
        <ManageUserHeader search={search} setSearch={setSearch} />

        <HStack mb={5} gap={3} flexWrap="wrap">
          <Badge bg="#edf4ff" color="#2b4c7e" px={3} py={1.5} borderRadius="full">
            Total Users: {totalUsers}
          </Badge>
          <Badge bg="#f8fbff" color="#2b4c7e" px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="#dbe5f4">
            Showing: {filteredCount}
          </Badge>
        </HStack>

        <Separator mb={6} borderColor="gray.300" />

        <Box>
          <UserTable
            users={filteredUsers}
            onModerate={loadUserComments}
            onDelete={handleDelete}
          />
        </Box>

        {moderationUser && (
          <UserCommentsPanel
            user={moderationUser}
            groups={moderationGroups}
            loading={moderationLoading}
            onDeleteComment={handleDeleteComment}
            deletingCommentId={deletingCommentId}
            onClose={() => {
              setModerationUser(null);
              setModerationGroups([]);
            }}
          />
        )}
      </Box>
    </Box>
  );
}
