import { Box, Heading, Table, Text, VStack } from "@chakra-ui/react";
import UserActionButtons from "./UserActionButtons";

export default function UserTable({ users, onView, onDelete }) {
    return (
        <Box
            border="2px solid"
            borderColor="gray.300"
            bg="#c8d4ea"
            h="100%"
            overflow="hidden"
        >
            <Box bg="#4f79bd" px={6} py={5}>
                <Heading size="lg" color="white" fontWeight="700">
                    List of Users
                </Heading>
            </Box>

            <Box px={10} py={8} h="calc(100% - 84px)" overflow="hidden">
                <Box bg="white" h="100%" overflowY="auto" borderRadius="8px">
                    <Table.Root size="lg">
                        <Table.Header position="sticky" top="0" bg="#f7f7f7" zIndex="1">
                            <Table.Row>
                                <Table.ColumnHeader fontSize="lg" fontWeight="700" w="120px">
                                    No.
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize="lg" fontWeight="700">
                                    Friend Name
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize="lg" fontWeight="700" w="200px">
                                    Action
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <Table.Row key={user.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{user.name}</Table.Cell>
                                        <Table.Cell>
                                            <UserActionButtons
                                                user={user}
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