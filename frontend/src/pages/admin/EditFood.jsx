import { Box } from "@chakra-ui/react";
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
      <Box
        w="100%"
        maxW="900px"
        minW={0}
      >
        <EditFoodForm foodId={id} />
      </Box>
    </Box>
  );
}
