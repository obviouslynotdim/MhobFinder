import { Box, Heading, Table, Text, VStack } from "@chakra-ui/react";
import UserActionButtons from "./UserActionButtons";
import { colors } from "../../../theme/tokens.js";

export default function UserTable({ users, onModerate, onDelete }) {
    return (
        <Box
            border="1px solid"
            borderColor="#dbe5f4"
            bg="#fbfdff"
            borderRadius="18px"
            overflow="hidden"
        >
            <Box bg="#f4f8ff" px={{ base: 4, md: 6 }} py={4} borderBottom="1px solid" borderColor="#dbe5f4">
                <Heading size={{ base: "md", md: "lg" }} color={colors.darkest} fontWeight="700">
                    List of Users
                </Heading>
            </Box>

            <Box px={{ base: 3, md: 6 }} py={{ base: 4, md: 6 }}>
                <Box bg="white" borderRadius="14px" border="1px solid" borderColor="#dbe5f4" overflowX="auto">
                    <Table.Root size={{ base: "sm", md: "md" }}>
                        <Table.Header position="sticky" top="0" bg="#f8fbff" zIndex="1">
                            <Table.Row>
                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} color={colors.darkest} fontWeight="700" w="70px">
                                    No.
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} color={colors.darkest} fontWeight="700" minW="220px">
                                    User
                                </Table.ColumnHeader>

                                <Table.ColumnHeader fontSize={{ base: "sm", md: "md" }} color={colors.darkest} fontWeight="700" w={{ base: "180px", md: "240px" }}>
                                    Action
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <Table.Row key={user.user_id || user.id} _hover={{ bg: "#fbfdff" }}>
                                        <Table.Cell color="gray.700">{index + 1}</Table.Cell>
                                        <Table.Cell>
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="700" color={colors.darkest}>
                                                    {user.name || "Unknown"}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500" wordBreak="break-word">
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