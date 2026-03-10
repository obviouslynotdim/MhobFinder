import {
  Box,
  Button,
  Input,
  Text,
  Textarea,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiImage, FiPlusSquare } from "react-icons/fi";

export default function AddFood() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      pt="40px"
    >
      <Box
        bg="#cfdaf0"
        borderRadius="20px"
        p="40px"
        width="700px"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          Add Food Page
        </Text>

        <Box border="1px solid #c6c6c6">
          <Box bg="#5a82c4" p="4">
            <Text color="white" fontSize="xl" fontWeight="bold">
              Add New Food
            </Text>
          </Box>

          <VStack p="6" spacing="5" align="stretch">
            <Box>
              <Text fontWeight="bold">Title</Text>
              <Input placeholder="Add title ..." bg="white" borderRadius="20px" />
            </Box>

            <Box>
              <Text fontWeight="bold">Description</Text>
              <Textarea
                placeholder="Add description ..."
                bg="white"
                borderRadius="20px"
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Ingredient list</Text>
              <Input placeholder="List" bg="white" borderRadius="20px" />
            </Box>

            <Box>
              <Text fontWeight="bold">Category</Text>
              <Input placeholder="Category" bg="white" borderRadius="20px" />
            </Box>

            <HStack justify="space-between" pt="4">
              <Button
                leftIcon={<FiImage />}
                bg="#4f79bd"
                color="white"
                borderRadius="20px"
                px="8"
                _hover={{ bg: "#3e66a3" }}
              >
                Insert IMG
              </Button>

              <Button
                leftIcon={<FiPlusSquare />}
                bg="#4f79bd"
                color="white"
                borderRadius="20px"
                px="8"
                _hover={{ bg: "#3e66a3" }}
              >
                Add Food
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}