import { Box, Input, Text, Textarea } from "@chakra-ui/react";

export default function AddFoodFormField({
    label,
    placeholder,
    value,
    onChange,
    isTextarea = false,
}) {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="700" color="gray.500" mb={2}>
                {label}
            </Text>

            {isTextarea ? (
                <Textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    bg="white"
                    borderRadius="18px"
                    minH="52px"
                    resize="vertical"
                    border="none"
                    _placeholder={{ color: "gray.400" }}
                />
            ) : (
                <Input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    bg="white"
                    borderRadius="18px"
                    h="52px"
                    border="none"
                    _placeholder={{ color: "gray.400" }}
                />
            )}
        </Box>
    );
}