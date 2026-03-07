import { Box, HStack, Text, VStack } from "@chakra-ui/react";

export default function TopRecipesCard() {
    return (
        <Box bg="white" borderRadius="14px" p={5} boxShadow="sm" h="100%">
            <Text fontSize="xl" fontWeight="700" mb={3}>
                Top Recipes
            </Text>

            <HStack justify="space-between">
                <Box
                    w="160px"
                    h="160px"
                    borderRadius="50%"
                    bg="conic-gradient(#2f79d1 0deg 120deg,#73a8df 120deg 245deg,#a9ccef 245deg 360deg)"
                />

                <VStack align="start">
                    <Box>
                        <Text>Chocolate Chip Cookies</Text>
                        <Text fontWeight="bold">32%</Text>
                    </Box>

                    <Box>
                        <Text>Spaghetti Bolognese</Text>
                        <Text fontWeight="bold">18%</Text>
                    </Box>

                    <Text>Caesar Salad</Text>
                </VStack>
            </HStack>
        </Box>
    );
}