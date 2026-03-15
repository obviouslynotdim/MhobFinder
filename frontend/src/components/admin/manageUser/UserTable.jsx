import { Box, Heading, Table, Text, VStack } from "@chakra-ui/react";
import UserActionButtons from "./UserActionButtons";

export default function UserTable({ users, onModerate, onDelete }) {
    return (
        <Box
            border="1px solid"
            borderColor="blue.100"
            bg="#e9f1ff"
            borderRadius="16px"
            overflow="hidden"
        >
            <Box bg="linear-gradient(120deg, #4f79bd 0%, #6ea0df 100%)" px={{ base: 4, md: 6 }} py={4}>
                <Heading size={{ base: "md", md: "lg" }} color="white" fontWeight="700">
                    List of Users
                </Heading>
            </Box>

            <Box px={{ base: 3, md: 6 }} py={{ base: 4, md: 6 }}>
                <Box bg="white" borderRadius="10px" border="1px solid" borderColor="gray.100" overflowX="auto">
                    <Table.Root size={{ base: "sm", md: "md" }}>
                        <Table.Header position="sticky" top="0" bg="#f7f7f7" zIndex="1">
                            <Table.Row>
                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} fontWeight="700" w="70px">
                                    No.
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} fontWeight="700" minW="220px">
                                    User
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} fontWeight="700" w={{ base: "180px", md: "240px" }}>
                                    Action
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <Table.Row key={user.user_id || user.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="600" color="gray.700">
                                                    {user.name || "Unknown"}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {user.email || "No email"}
                                                </Text>
                                            </VStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <UserActionButtons
                                                user={user}
                                                onModerate={onModerate}
                                                onDelete={onDelete}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={3} py={8}>
                                        <VStack>
                                            <Text color="gray.500" fontSize="lg">
                                                No users found.
                                            </Text>
                                        </VStack>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </Box>
    );
}