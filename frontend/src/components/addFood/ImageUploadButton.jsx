import { Button } from "@chakra-ui/react";
import { FiImage } from "react-icons/fi";

export default function ImageUploadButton({ onChange }) {
    return (
        <Button
            as="label"
            bg="#4f79bd"
            color="white"
            borderRadius="18px"
            px={10}
            py={7}
            fontSize="2xl"
            fontWeight="700"
            _hover={{ bg: "#4269a8" }}
            cursor="pointer"
        >
            <FiImage style={{ marginRight: "8px" }} />
            Insert IMG
            <input type="file" hidden accept="image/*" onChange={onChange} />
        </Button>
    );
}