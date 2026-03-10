import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopBarLeft from "./TopBarLeft.jsx";
import TopBarRight from "./TopBarRight.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import bgPattern from "../assets/mhob-background.png";

export default function AdminLayout() {
  const { open, onToggle } = useDisclosure({ defaultOpen: true });

  return (
    <Flex h="100vh" bg="#dce8fb" overflow="hidden">
      <AdminSidebar expanded={open} onToggle={onToggle} />

      <Flex flex="1" direction="column" minW={0} overflow="hidden">
        {/* Top App Bar */}
        <Flex
          h="92px"
          bg="#4f79bd"
          align="center"
          justify="space-between"
          px={6}
          color="white"
          flexShrink={0}
        >
          <TopBarRight />
        </Flex>

        {/* Page Area */}
        <Box
          flex="1"
          minW={0}
          minH={0}
          overflow="hidden"
          bgImage={`url(${bgPattern})`}
          bgRepeat="repeat"
          bgSize="420px"
          p={4}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}