import { Box, HStack, Text } from "@chakra-ui/react";

export default function VisitorsCard() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <Box bg="white" borderRadius="14px" p={5} boxShadow="sm" h="100%">
            <Text fontSize="xl" fontWeight="700" mb={2}>
                Website Visitors
            </Text>

            <Text fontSize="4xl" fontWeight="800" mb={3}>
                14,530
            </Text>

            {/* Graph */}
            <Box h="140px" position="relative">

                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {/* area */}
                    <polyline
                        fill="rgba(80,140,220,0.2)"
                        stroke="none"
                        points="0,75 16,75 32,53 48,31 64,40 80,12 96,22 96,100 0,100"
                    />

                    {/* line */}
                    <polyline
                        fill="none"
                        stroke="#4f93e6"
                        strokeWidth="2"
                        points="0,75 16,75 32,53 48,31 64,40 80,12 96,22"
                    />
                </svg>

            </Box>

            <HStack justify="space-between" mt="2">
                {days.map(d => (
                    <Text key={d} fontSize="xs">{d}</Text>
                ))}
            </HStack>
        </Box>
    );
}