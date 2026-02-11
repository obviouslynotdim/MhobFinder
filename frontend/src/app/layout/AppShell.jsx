import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import TopBarLeft from "../../components/TopBarLeft.jsx";
import TopBarRight from "../../components/TopBarRight.jsx";
import Sidebar from "../../components/Sidebar.jsx";


export default function AppShell() {
  const [userCollapsed, setUserCollapsed] = useState(false);
  const loc = useLocation();

  // ✅ auto-collapse on About, otherwise use user toggle
  const collapsed =
    loc.pathname.startsWith("/about") || loc.pathname.startsWith("/favorites")
      ? true
      : userCollapsed;


  const sidebarW = collapsed ? "72px" : "440px";
  const headerH = "90px";

  

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <Flex h={headerH} flex="0 0 auto" overflow="hidden">
        <Box
          w={sidebarW}
          bg="#4975BB"
          px="4"
          display="flex"
          alignItems="center"
        >
          <TopBarLeft
            collapsed={collapsed}
            onToggleCollapse={() => setUserCollapsed((v) => !v)}
          />
        </Box>

        <Box w="4px" bg="blackAlpha.400" />

        <Box flex="1" bg="#4975BB" px="6" display="flex" alignItems="center">
          <TopBarRight />
        </Box>
      </Flex>

      <Flex flex="1" minH="0" overflow="hidden">
        <Box
          w={sidebarW}
          bg={collapsed ? "#4975BB" : "#E1EDFE"} // Change color when collapsed
          minH="0"
          overflowY="auto"
        >
          <Sidebar collapsed={collapsed} />
        </Box>

        <Box w="4px" bg="blackAlpha.300" />

        <Box
          flex="1"
          minH="0"
          overflow="hidden"
          position="relative"
          bg="#E1EDFE"
        >
          {/* background pattern layer */}
          <Box
            position="absolute"
            inset="0"
            bgImage="url('/assets/bg.png')" // rename if you can
            bgRepeat="repeat"
            bgSize="320px" // smaller = less “zoomed in”
            bgPosition="0 0"
            opacity={0.38} // lower = more subtle
            pointerEvents="none"
          />

          {/* your scrollable content */}
          <Box
            position="relative"
            zIndex="1"
            h="100%"
            overflowY="auto"
            minH="0"
          >
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
