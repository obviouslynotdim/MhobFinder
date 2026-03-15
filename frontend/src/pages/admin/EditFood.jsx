import { Box, Separator } from "@chakra-ui/react";
import EditFoodForm from "../../components/admin/editFood/EditFoodForm.jsx";
import { useParams } from "react-router-dom";

export default function EditFood() {
  const { id } = useParams();
  return (
    <Box
      px={{ base: 0, md: 4 }}
      py={{ base: 0, md: 6 }}
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      h="100%"
      overflow="auto"
    >
      <Box w="100%" maxW="760px" bg="#cfdaf0" borderRadius={{ base: "16px", md: "20px" }} p={{ base: 4, md: 6 }}>
        <Separator mb={4} borderColor="gray.300" />
        <EditFoodForm foodId={id} />
      </Box>
    </Box>
  );
}
