import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import TopBarLeft from "../TopBarLeft.jsx";
import TopBarRight from "../TopBarRight.jsx";
import Sidebar from "./Sidebar.jsx";
import backgroundImage from "../../assets/bg.png";
import FoodAssistantWidget from "../../components/common/FoodAssistantWidget.jsx";

export default function AppShell() {
  const [userCollapsed, setUserCollapsed] = useState(false);
  const loc = useLocation();

  const collapsed = loc.pathname.startsWith("/about") ? true : userCollapsed;
  const hideTopBarRight = loc.pathname === "/";

  const sidebarW = collapsed
    ? "72px"
    : { base: "260px", md: "320px", lg: "380px" };

  const headerH = "120px";

  return (
    <Flex h="100vh" overflow="hidden">
      {/* LEFT COLUMN (scrolls as ONE unit) */}
      <Box
        w={sidebarW}
        bg={collapsed ? "#4975BB" : "#E1EDFE"}
        overflowY="auto" // scroll here
        transition="width 0.2s ease"
      >
        {/* TopBarLeft */}
        <Box h={headerH} px="4" display="flex" alignItems="center" bg="#4975BB">
          <TopBarLeft
            collapsed={collapsed}
            onToggleCollapse={() => setUserCollapsed((v) => !v)}
          />
        </Box>

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />
      </Box>

      <Box w="4px" bg="blackAlpha.300" />

      {/* RIGHT COLUMN */}
      <Flex flex="1" direction="column" overflow="hidden">
        {!hideTopBarRight && (
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
        )}

        {/* Content Scroll */}
        <Box
          flex="1"
          overflowY="auto"
          position="relative"
          bg="linear-gradient(180deg, #F8FAFF 0%, #EEF4FF 100%)"
        >
          {!hideTopBarRight && (
            <Box
              position="absolute"
              inset="0"
              bgImage={`url(${backgroundImage})`}
              bgRepeat="repeat"
              bgSize="320px"
              opacity={0.18}
              pointerEvents="none"
            />
          )}

          <Box
            position="relative"
            zIndex="1"
            px={hideTopBarRight ? 0 : { base: 2, md: 3 }}
            py={hideTopBarRight ? 0 : { base: 2, md: 3 }}
          >
            <Outlet />
          </Box>
        </Box>
      </Flex>

      <FoodAssistantWidget />
    </Flex>
  );
}
