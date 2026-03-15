import { Box, HStack, Text, Input, InputGroup } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { colors } from "../../../theme/tokens.js";

export default function ManageUserHeader({ search, setSearch }) {
    return (
        <HStack
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mb={5}
            gap={4}
            flexDirection={{ base: "column", md: "row" }}
        >
            <Box>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
                    User Management
                </Text>
                <Box color="gray.600" fontSize="sm" mt={1}>
                    Monitor users and moderate their comments by recipe.
                </Box>
            </Box>

            <InputGroup
                maxW={{ base: "100%", md: "340px" }}
                startElement={<FiSearch size="16" color="#718096" />}
            >
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email"
                    bg="white"
                    borderRadius="full"
                    h="46px"
                    border="1px solid"
                    borderColor="#dbe5f4"
                    _placeholder={{ color: "gray.500" }}
                />
            </InputGroup>
        </HStack>
    );
}