import {
    Badge,
    Box,
    Flex,
    HStack,
    IconButton,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";
import { colors } from "../theme/tokens.js";

function truncateDescription(text = "", maxLength = 95) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "...";
}

function getShortLink(url = "") {
    try {
        const parsed = new URL(url);
        const normalized = `${parsed.hostname}${parsed.pathname}`;
        if (normalized.length <= 48) return normalized;
        return `${normalized.slice(0, 45)}...`;
    } catch {
        if (url.length <= 48) return url;
        return `${url.slice(0, 45)}...`;
    }
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

function AdminFoodCard({
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
        description = "No description available",
        image_url,
        categories = [],
        ingredients = [],
        link_url,
    } = food;

    const shortDescription = truncateDescription(description, 95);
    const fallbackImage = makeFallbackImage(title);
    const categoryNames = Array.isArray(categories) && categories.length > 0
        ? categories.map((category) => category.name).filter(Boolean)
        : ["Uncategorized"];

    return (
        <Flex
            direction={{ base: "column", xl: "row" }}
            w="100%"
            minW={0}
            bg="#fbfdff"
            borderRadius="22px"
            border={isSelected ? `2px solid ${colors.primary}` : "1px solid #dbe5f4"}
            boxShadow={isSelected ? "0 12px 30px rgba(79,121,189,0.18)" : "0 8px 22px rgba(79,121,189,0.08)"}
            p={{ base: 4, md: 5 }}
            gap={{ base: 4, md: 5 }}
            align={{ base: "stretch", md: "center" }}
            position="relative"
            minH={{ base: "auto", md: "220px" }}
            transition="all 0.2s ease"
            cursor={selectionMode ? "pointer" : "default"}
            _hover={{
                boxShadow: "0 14px 32px rgba(79,121,189,0.14)",
                transform: "translateY(-2px)",
                bg: "#ffffff",
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
                    boxShadow="sm"
                >
                    {isSelected && <FiCheck color="white" size={14} />}
                </Box>
            ) : null}

            <Box
                flexShrink={0}
                w={{ base: "100%", xl: "220px" }}
                maxW={{ base: "100%", xl: "220px" }}
                h={{ base: "180px", xl: "180px" }}
                borderRadius="20px"
                overflow="hidden"
                bg="white"
                border="1px solid #dbe5f4"
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
                pr={selectionMode ? 10 : { base: 0, xl: 2 }}
            >
                <Text
                    fontWeight="800"
                    fontSize={{ base: "xl", md: "2xl" }}
                    color={colors.darkest}
                    noOfLines={1}
                    w="100%"
                >
                    {title}
                </Text>

                <HStack spacing={2} flexWrap="wrap">
                    {categoryNames.slice(0, 2).map((categoryName) => (
                        <Badge
                            key={categoryName}
                            bg="#edf4ff"
                            color={colors.darkest}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            {categoryName}
                        </Badge>
                    ))}
                    <Text fontSize="xs" color="gray.500">
                        {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
                    </Text>
                </HStack>

                <Text
                    fontSize="sm"
                    color="gray.600"
                    lineHeight="1.6"
                    noOfLines={3}
                    w="100%"
                >
                    {shortDescription}
                </Text>

                {link_url && (
                    <Link
                        href={link_url}
                        isExternal
                        fontSize="xs"
                        color={colors.primary}
                        w="100%"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={link_url}
                        textDecoration="underline"
                        textUnderlineOffset="2px"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {getShortLink(link_url)}
                    </Link>
                )}

                {!selectionMode && (
                    <HStack spacing={2} pt={2} w="100%" justify="flex-end" mt="auto">
                        <IconButton
                            aria-label="Edit food"
                            size="sm"
                            bg={colors.primary}
                            color="white"
                            borderRadius="10px"
                            _hover={{ bg: colors.dark }}
                            onClick={() => onEdit(food)}
                        >
                            <FiEdit2 />
                        </IconButton>

                        <IconButton
                            aria-label="Delete food"
                            size="sm"
                            bg="red.50"
                            color="red.600"
                            borderRadius="10px"
                            _hover={{ bg: "red.100" }}
                            onClick={() => onDelete(food_id)}
                        >
                            <FiTrash2 />
                        </IconButton>
                    </HStack>
                )}
            </VStack>
        </Flex>
    );
}

export default AdminFoodCard;