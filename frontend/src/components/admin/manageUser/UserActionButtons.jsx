import { Button, HStack } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";

export default function UserActionButtons({ user, onModerate, onDelete }) {
  const userId = user.user_id || user.id;

  return (
    <HStack gap={2} flexWrap="wrap">
      <Button
        size="sm"
        bg="#edf4ff"
        color="#2b4c7e"
        borderRadius="8px"
        _hover={{ bg: "#dfeafb" }}
        onClick={() => onModerate(user)}
      >
        Comments
      </Button>

      <Button
        size="sm"
        variant="outline"
        borderColor="#ef4444"
        color="#ef4444"
        bg="white"
        borderRadius="8px"
        onClick={() => onDelete(userId)}
      >
        <FiTrash2 />
      </Button>
    </HStack>
  );
}
