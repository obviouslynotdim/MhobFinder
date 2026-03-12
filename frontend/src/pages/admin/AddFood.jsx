import { Box } from "@chakra-ui/react";
import AddFoodForm from "../../components/addFood/AddFoodForm";

export default function AddFood() {
    return (
        <Box
            w="100%"
            px={2}
            py={2}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <AddFoodForm />
        </Box>
    );
}