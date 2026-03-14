import { Box, Separator } from "@chakra-ui/react";
import EditFoodForm from "../../components/admin/editFood/EditFoodForm.jsx";
import { useParams } from "react-router-dom";

export default function EditFood() {
  const { id } = useParams();
  return (
    <Box
      px={4}
      py={6}
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Box w="100%" maxW="760px" bg="#cfdaf0" borderRadius="20px" p={6}>
        <Separator mb={4} borderColor="gray.300" />
        <EditFoodForm foodId={id} />
      </Box>
    </Box>
  );
}
