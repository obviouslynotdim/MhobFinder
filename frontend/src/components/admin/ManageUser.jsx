import { useMemo, useState } from "react";
import { Box, Separator } from "@chakra-ui/react";
import ManageUserHeader from "../../components/manageUser/ManageUserHeader";
import UserTable from "../../components/manageUser/UserTable";

export default function ManageUser() {
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState([
        { id: 1, name: "dim" },
        { id: 2, name: "vixy" },
        { id: 3, name: "salty" },
        { id: 4, name: "lemon" },
        { id: 5, name: "lita" },
        { id: 6, name: "norin" },
        { id: 7, name: "anna" },
        { id: 8, name: "bella" },
        { id: 9, name: "james" },
        { id: 10, name: "john" },
        { id: 11, name: "alex" },
        { id: 12, name: "david" },
    ]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const handleView = (user) => {
        alert(`Frontend only: view ${user.name}`);
    };

    const handleDelete = (userId) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

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