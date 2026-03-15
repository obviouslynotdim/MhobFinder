import { Box } from "@chakra-ui/react";
import AddFoodForm from "../../components/admin/addFood/AddFoodForm";

export default function AddFood() {
  return (
    <Box
      w="100%"
      px={{ base: 0, md: 2 }}
      py={{ base: 0, md: 2 }}
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      h="100%"
      overflow="auto"
    >
      <AddFoodForm />
    </Box>
  );
}
