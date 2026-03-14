import { HStack, Image, Text } from "@chakra-ui/react";

export default function UserProfile({ user }) {
    return (
        <HStack justify="space-between" mb={6}>
            <Image
                src={user.avatar}
                alt={user.name}
                boxSize="85px"
                borderRadius="full"
                bg="white"
            />

            <Text fontSize="lg" color="#2f4f88">
                View Activity
            </Text>
        </HStack>
    );
}