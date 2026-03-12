import { Button, HStack } from "@chakra-ui/react";
import { FiList, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserActionButtons({ user, onDelete }) {
    const navigate = useNavigate();

    return (
        <HStack gap={3}>
            <Button
                variant="outline"
                borderColor="#3b82f6"
                color="#3b82f6"
                bg="white"
                borderRadius="8px"
                minW="46px"
                h="46px"
                onClick={() => navigate(`/admin/manage-user/${user.id}`)}
            >
                <FiList />
            </Button>

            <Button
                variant="outline"
                borderColor="#ef4444"
                color="#ef4444"
                bg="white"
                borderRadius="8px"
                minW="46px"
                h="46px"
                onClick={() => onDelete(user.id)}
            >
                <FiTrash2 />
            </Button>
        </HStack>
    );
}