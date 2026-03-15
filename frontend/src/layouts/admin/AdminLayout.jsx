import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TopBarRight from "../TopBarRight.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout() {
  const expandedByDefault = useBreakpointValue({ base: false, md: true });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(Boolean(expandedByDefault));
  }, [expandedByDefault]);

  return (
    <Flex h="100vh" bg="#dce8fb" overflow="hidden">
      <AdminSidebar
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      />

      <Flex flex="1" direction="column" minW={0} overflow="hidden">
        {/* Top App Bar */}
        <Flex
          h={{ base: "88px", md: "84px" }}
          bg="#4f79bd"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 6 }}
          color="white"
          flexShrink={0}
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
        >
          <TopBarRight />
        </Flex>

        {/* Page Area */}
        <Box
          flex="1"
          minW={0}
          minH={0}
          overflow="hidden"
          bg="linear-gradient(180deg, #f4f8ff 0%, #e7eefb 100%)"
          p={{ base: 2, md: 4 }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
