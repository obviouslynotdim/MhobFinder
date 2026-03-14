import { Box, HStack, Heading, Input } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function ManageUserHeader({ search, setSearch }) {
    return (
        <HStack justify="space-between" align="center" mb={3} gap={4}>
            <Heading size="xl" color="gray.700" fontWeight="700">
                User Manage Page
            </Heading>

            <Box position="relative" w="320px" maxW="100%">
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
                    placeholder="Search User"
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