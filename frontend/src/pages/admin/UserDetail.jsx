import { Box, Heading, Separator, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserDetailHeader from "../../components/admin/userDetail/UserDetailHeader";
import UserProfile from "../../components/admin/userDetail/UserProfile";
import UserInfoFields from "../../components/admin/userDetail/UserInfoFields";
import { fetchAllUsers, deleteUser } from "../../services/api/user.service";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

export default function UserDetail() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (hasLoaded) return;
    let didCancel = false;
    async function loadUsers() {
      try {
        const data = await fetchAllUsers();
        if (!didCancel) setUsers(data);
      } catch {
        if (!didCancel) setUsers([]);
      } finally {
        if (!didCancel) {
          setLoading(false);
          setHasLoaded(true);
        }
      }
    }
    loadUsers();
    return () => {
      didCancel = true;
    };
  }, [hasLoaded]);

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoadingState
        title="Loading user details"
        description="Please wait while we fetch account information."
        minH="320px"
      />
    );
  }
  if (!users.length) return <Box p={6}>No users found</Box>;

  return (
    <Box
      h="calc(100vh - 90px - 48px)"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Box w="100%" maxW="820px" bg="#cfdaf0" borderRadius="24px" p={7}>
        <UserDetailHeader />
        <Separator mb={6} borderColor="gray.300" />
        <Box
          border="2px solid"
          borderColor="gray.300"
          bg="#c8d4ea"
          borderRadius="12px"
          p={6}
        >
          <Heading size="md" color="white" bg="#4f79bd" p={4} mb={6}>
            Users Details
          </Heading>
          {users.map((user) => (
            <Box key={user.user_id} mb={8}>
              <UserProfile user={user} />
              <UserInfoFields user={user} />
              <Button
                colorScheme="red"
                onClick={() => handleDelete(user.user_id)}
              >
                Delete User
              </Button>
              <Separator mb={6} borderColor="gray.300" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
