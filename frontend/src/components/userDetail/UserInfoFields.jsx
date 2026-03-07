import { Box, Text, VStack } from "@chakra-ui/react";

export default function UserInfoFields({ user }) {
    const fieldStyle = {
        bg: "white",
        boxShadow: "md",
        px: 5,
        py: 3,
        w: "100%",
        borderRadius: "8px",
    };

    return (
        <VStack spacing={4} align="stretch">
            <Box {...fieldStyle}>
                <Text fontWeight="600">
                    User name: <Text as="span" fontWeight="400">{user.name}</Text>
                </Text>
            </Box>

            <Box {...fieldStyle}>
                <Text fontWeight="600">
                    Phone number: <Text as="span" fontWeight="400">{user.phone}</Text>
                </Text>
            </Box>

            <Box {...fieldStyle}>
                <Text fontWeight="600">
                    Gender: <Text as="span" fontWeight="400">{user.gender}</Text>
                </Text>
            </Box>

            <Box {...fieldStyle}>
                <Text fontWeight="600">
                    Email: <Text as="span" fontWeight="400">{user.email}</Text>
                </Text>
            </Box>

            <Box {...fieldStyle}>
                <Text fontWeight="600">
                    DOB: <Text as="span" fontWeight="400">{user.dob}</Text>
                </Text>
            </Box>
        </VStack>
    );
}