import { Box, Heading, Separator } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import EditFoodForm from "../../components/editFood/EditFoodForm.jsx";

export default function EditFood() {
    const location = useLocation();
    const food = location.state?.food;

    return (
        <Box
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
                <Separator mb={4} borderColor="gray.300" />

                <EditFoodForm food={food} />
            </Box>
        </Box>
    );
}