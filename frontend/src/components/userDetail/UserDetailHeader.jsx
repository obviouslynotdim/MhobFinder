import { Heading, HStack, Input } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function UserDetailHeader() {
    return (
        <HStack justify="space-between" mb={3}>
            <Heading size="lg" color="gray.700" fontWeight="700">
                User Manage Page
            </Heading>

            <Input
                placeholder="Search User"
                maxW="260px"
                bg="white"
                borderRadius="8px"
            />
        </HStack>
    );
}