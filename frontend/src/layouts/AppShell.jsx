import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import TopBarLeft from "./TopBarLeft.jsx";
import TopBarRight from "./TopBarRight.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppShell() {
  const [userCollapsed, setUserCollapsed] = useState(false);
  const loc = useLocation();

  const collapsed = loc.pathname.startsWith("/about")
    ? true
    : userCollapsed;

  const sidebarW = collapsed
    ? "72px"
    : { base: "260px", md: "320px", lg: "380px" };

  const headerH = "90px";

  return (
    <Flex h="100vh" overflow="hidden">
      {/* LEFT COLUMN (scrolls as ONE unit) */}
      <Box
        w={sidebarW}
        bg={collapsed ? "#4975BB" : "#E1EDFE"}
        overflowY="auto"     // scroll here
        transition="width 0.2s ease"
      >
        {/* TopBarLeft */}
        <Box
          h={headerH}
          px="4"
          display="flex"
          alignItems="center"
          bg="#4975BB"
        >
          <TopBarLeft
            collapsed={collapsed}
            onToggleCollapse={() =>
              setUserCollapsed((v) => !v)
            }
          />
        </Box>

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />
      </Box>

      <Box w="4px" bg="blackAlpha.300" />

      {/* RIGHT COLUMN */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* TopBarRight */}
        <Box
          h={headerH}
          px="6"
          display="flex"
          alignItems="center"
          bg="#4975BB"
          flexShrink="0"
        >
          <TopBarRight />
        </Box>

        {/* Content Scroll */}
        <Box
          flex="1"
          overflowY="auto"
          position="relative"
          bg="#E1EDFE"
        >
          <Box
            position="absolute"
            inset="0"
            bgImage="url('/assets/bg.png')"
            bgRepeat="repeat"
            bgSize="320px"
            opacity={0.38}
            pointerEvents="none"
          />

          <Box position="relative" zIndex="1" p="6">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}