import {
    Flex,
    Box,
    Image,
    Text,
    Badge,
    IconButton,
    VStack,
    HStack,
    Button,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";

function truncateDescription(text = "", maxLength = 95) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "...";
}

function makeFallbackImage(label = "Food") {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="100%" height="100%" fill="#dbe7f5"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="#4f79bd"
      >
        ${label}
      </text>
    </svg>
  `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function AdminFoodCard({
    food = {},
    onEdit,
    onDelete,
    selectionMode = false,
    isSelected = false,
    onToggleSelect,
}) {
    const {
        food_id,
        title = "Untitled Food",
        category = "Unknown",
        description = "No description available",
        image_url,
        status,
    } = food;

    const shortDescription = truncateDescription(description, 95);
    const fallbackImage = makeFallbackImage(title);

    return (
        <Flex
            w="100%"
            bg="#E3F2FD"
            borderRadius="24px"
            border={isSelected ? "2px solid #4f79bd" : "1px solid #c9d9ec"}
            boxShadow={isSelected ? "md" : "sm"}
            p={6}
            gap={6}
            align="center"
            position="relative"
            minH="220px"
            transition="all 0.2s ease"
            cursor={selectionMode ? "pointer" : "default"}
            _hover={{
                boxShadow: "md",
                transform: "translateY(-2px)",
                bg: "#dcecff",
            }}
            onClick={() => {
                if (selectionMode) onToggleSelect?.(food_id);
            }}
        >
            {selectionMode ? (
                <Box
                    position="absolute"
                    top="14px"
                    right="14px"
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor={isSelected ? "#4f79bd" : "gray.300"}
                    bg={isSelected ? "#4f79bd" : "white"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {isSelected && <FiCheck color="white" size={14} />}
                </Box>
            ) : (
                <HStack position="absolute" top="14px" right="14px" spacing={2}>
                    <IconButton
                        aria-label="Edit food"
                        icon={<FiEdit2 />}
                        size="sm"
                        borderRadius="full"
                        bg="transparent"
                        color="gray.500"
                        _hover={{ bg: "blue.50", color: "blue.500" }}
                        onClick={() => onEdit(food)}
                    />

                    <IconButton
                        aria-label="Delete food"
                        icon={<FiTrash2 />}
                        size="sm"
                        borderRadius="full"
                        bg="transparent"
                        color="gray.500"
                        _hover={{ bg: "red.50", color: "red.500" }}
                        onClick={() => onDelete(food_id)}
                    />
                </HStack>
            )}

            <Box
                flexShrink={0}
                w="180px"
                h="180px"
                borderRadius="full"
                overflow="hidden"
                bg="white"
                border="4px solid #d7e4f3"
            >
                <Image
                    src={image_url || fallbackImage}
                    alt={title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                    }}
                />
            </Box>

            <VStack
                align="start"
                spacing={3}
                flex="1"
                minW={0}
                w="100%"
                pr={selectionMode ? 10 : 20}
            >
                <Text
                    fontWeight="800"
                    fontSize="2xl"
                    color="gray.800"
                    noOfLines={1}
                    w="100%"
                >
                    {title}
                </Text>

                <HStack spacing={2} flexWrap="wrap">
                    <Badge
                        bg="#4f79bd"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="700"
                    >
                        {category}
                    </Badge>

                    {status && (
                        <Badge
                            bg={status === "Published" ? "green.100" : "orange.100"}
                            color={status === "Published" ? "green.700" : "orange.700"}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            {status}
                        </Badge>
                    )}
                </HStack>

                <Text
                    fontSize="sm"
                    color="gray.600"
                    lineHeight="1.6"
                    noOfLines={2}
                    w="100%"
                >
                    {shortDescription}
                </Text>

                {!selectionMode && (
                    <HStack spacing={3} pt={1}>
                        <Button
                            size="sm"
                            leftIcon={<FiEdit2 />}
                            bg="#4f79bd"
                            color="white"
                            borderRadius="full"
                            _hover={{ bg: "#4269a8" }}
                            onClick={() => onEdit(food)}
                        >
                            Edit
                        </Button>

                        <Button
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            bg="red.100"
                            color="red.600"
                            borderRadius="full"
                            _hover={{ bg: "red.200" }}
                            onClick={() => onDelete(food_id)}
                        >
                            Delete
                        </Button>
                    </HStack>
                )}
            </VStack>
        </Flex>
    );
}