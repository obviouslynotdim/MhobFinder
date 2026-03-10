import { Box, Heading, Separator } from "@chakra-ui/react";
import AddFoodForm from "../../components/addFood/AddFoodForm";

export default function AddFood() {
    return (
        <Box
            minH="10vh"
            px={4}
            py={6}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                w="100%"
                maxW="760px"
                bg="#cfdaf0"
                borderRadius="20px"
                p={6}
            >
                <Heading size="lg" color="gray.700" mb={3} fontWeight="700">
                    Add Food Page
                </Heading>

                <Separator mb={4} borderColor="gray.300" />

                <AddFoodForm />
            </Box>
        </Box>
    );
}