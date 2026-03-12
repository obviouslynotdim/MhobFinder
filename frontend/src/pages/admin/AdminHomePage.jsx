import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../../layouts/Sidebar.jsx";
import Home from "../Home.jsx";

export default function AdminHome() {
    return (
        <Flex h="100%" minH={0} gap={4} overflow="hidden">
            {/* Ingredient panel */}
            <Box
                w={{ base: "320px", md: "360px" }}
                bg="#dce8fb"
                border="2px solid #d2d8e2"
                borderRadius="20px"
                overflow="hidden"
                flexShrink={0}
                minH={0}
            >
                <Box h="100%" overflowY="auto">
                    <Sidebar />
                </Box>
            </Box>

            {/* Food display panel */}
            <Box
                flex="1"
                minW={0}
                minH={0}
                bg="#dce8fb"
                border="2px solid #d2d8e2"
                borderRadius="20px"
                overflow="hidden"
            >
                <Box h="100%" overflowY="auto">
                    <Home />
                </Box>
            </Box>
        </Flex>
    );
}