import { Button, HStack } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { colors } from "../../../theme/tokens.js";

export default function UserActionButtons({ user, onModerate, onDelete }) {
  const userId = user.user_id || user.id;

  return (
    <HStack gap={2} flexWrap="wrap">
      <Button
        size="sm"
        bg="#edf4ff"
        color={colors.darkest}
        borderRadius="full"
        border="1px solid"
        borderColor="#dbe5f4"
        _hover={{ bg: colors.chipHover }}
        onClick={() => onModerate(user)}
      >
        Comments
      </Button>

      <Button
        size="sm"
        bg="red.50"
        color="red.600"
        borderRadius="full"
        _hover={{ bg: "red.100" }}
        onClick={() => onDelete(userId)}
      >
        <FiTrash2 />
      </Button>
    </HStack>
  );
}
