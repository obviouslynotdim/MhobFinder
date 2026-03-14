import { useMemo, useState, useEffect } from "react";
import { Box, Separator } from "@chakra-ui/react";
import ManageUserHeader from "../../components/admin/manageUser/ManageUserHeader";
import UserTable from "../../components/admin/manageUser/UserTable";
import { fetchAllUsers, deleteUser } from "../../services/api/user.service";

export default function ManageUser() {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

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
    if (!users.length) {
      loadUsers();
    } else {
      setLoading(false);
    }
    return () => {
      didCancel = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const handleView = (user) => {
    alert(`Frontend only: view ${user.name}`);
  };

  const handleDelete = async (userId) => {
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

  if (loading) return <Box p={6}>Loading...</Box>;
  if (!users.length) return <Box p={6}>No users found</Box>;

  return (
    <Box
      h="calc(100vh - 90px - 48px)"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Box
        w="100%"
        maxW="980px"
        h="100%"
        bg="#cfdaf0"
        borderRadius="24px"
        p={8}
        overflow="hidden"
      >
        <ManageUserHeader search={search} setSearch={setSearch} />

        <Separator mb={6} borderColor="gray.300" />

        <Box h="calc(100% - 90px)">
          <UserTable
            users={filteredUsers}
            onView={handleView}
            onDelete={handleDelete}
          />
        </Box>
      </Box>
    </Box>
  );
}
