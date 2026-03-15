import { Button } from "@chakra-ui/react";
import { FiImage } from "react-icons/fi";
import { colors } from "../../../theme/tokens.js";

export default function ImageUploadButton({ onChange }) {
    return (
        <Button
            as="label"
            bg={colors.chipBg}
            color={colors.darkest}
            borderRadius="full"
            border="1px solid"
            borderColor="#dbe5f4"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="700"
            _hover={{ bg: colors.chipHover }}
            cursor="pointer"
            w={{ base: "100%", md: "auto" }}
        >
            <FiImage style={{ marginRight: "8px" }} />
            Choose Image
            <input type="file" hidden accept="image/*" onChange={onChange} />
        </Button>
    );
}