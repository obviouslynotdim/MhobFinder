import { Box, HStack, Text } from "@chakra-ui/react";

export default function PopularIngredientCard() {
    return (
        <Box bg="white" borderRadius="14px" p={5} boxShadow="sm" h="100%">
            <Text fontSize="xl" fontWeight="700" mb={3}>
                Most Popular Ingredient
            </Text>

            <HStack justify="space-between">
                <Box
                    w="160px"
                    h="160px"
                    borderRadius="50%"
                    bg="conic-gradient(#2f79d1 0deg 126deg,#a9ccef 126deg 360deg)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        w="90px"
                        h="90px"
                        bg="white"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text fontWeight="bold">Chicken</Text>
                    </Box>
                </Box>

                <Text fontSize="4xl" fontWeight="800">
                    35%
                </Text>
            </HStack>
        </Box>
    );
}