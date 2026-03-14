import { Box, HStack, Text } from "@chakra-ui/react";

export default function VisitDurationCard() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <Box bg="white" borderRadius="14px" p={5} boxShadow="sm" h="100%">
            <Text fontSize="xl" fontWeight="700">
                Average Visit Duration
            </Text>

            <Text fontSize="4xl" fontWeight="800" mb={3}>
                4m 23s
            </Text>

            <HStack align="end" h="120px" gap={3}>
                {[7, 6, 7, 8, 10, 7, 12].map((v, i) => (
                    <Box key={i} w="14px" h={`${v * 8}px`} bg="#6aa3e6" borderRadius="3px" />
                ))}
            </HStack>

            <HStack justify="space-between">
                {days.map(d => (
                    <Text key={d} fontSize="xs">{d}</Text>
                ))}
            </HStack>
        </Box>
    );
}