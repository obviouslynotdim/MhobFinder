import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { colors } from "../../theme/tokens.js";

export default function AppLoadingState({
  title = "Loading...",
  description,
  fullScreen = false,
  minH = "240px",
}) {
  return (
    <Box
      h={fullScreen ? "100vh" : "auto"}
      minH={fullScreen ? undefined : minH}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={6}
    >
      <VStack
        gap={3}
        textAlign="center"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        borderRadius="16px"
        px={{ base: 5, md: 7 }}
        py={{ base: 5, md: 6 }}
        boxShadow="0 10px 24px rgba(79,121,189,0.10)"
        minW={{ base: "260px", md: "320px" }}
      >
        <Spinner size="lg" color={colors.primary} thickness="4px" />
        <Text fontWeight="700" color={colors.darkest}>
          {title}
        </Text>
        {description ? (
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
}
