import { Box, HStack, Heading, Input } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function ManageUserHeader({ search, setSearch }) {
    return (
        <HStack
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={3}
            gap={4}
            flexDirection={{ base: "column", md: "row" }}
        >
            <Box>
                <Heading size={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="700">
                    User Management
                </Heading>
                <Box color="gray.600" fontSize="sm" mt={1}>
                    Monitor users and moderate their comments by recipe.
                </Box>
            </Box>

            <Box position="relative" w={{ base: "100%", md: "340px" }} maxW="100%">
                <Box
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                    zIndex={1}
                >
                    <FiSearch />
                </Box>

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email"
                    bg="white"
                    borderRadius="14px"
                    h="48px"
                    pl="38px"
                    border="none"
                    _placeholder={{ color: "gray.400" }}
                />
            </Box>
        </HStack>
    );
}