import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiTrash2, FiX } from "react-icons/fi";

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function UserCommentsPanel({
  user,
  groups,
  loading,
  onClose,
  onDeleteComment,
  deletingCommentId,
}) {
  if (!user) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      bg="blackAlpha.500"
      zIndex="1600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 3, md: 6 }}
    >
      <Box
        bg="#fbfdff"
        border="1px solid"
        borderColor="#dbe5f4"
        borderRadius="20px"
        boxShadow="2xl"
        w="100%"
        maxW="980px"
        maxH="88vh"
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align="start"
          p={{ base: 4, md: 6 }}
          bg="#f4f8ff"
          color="#1f3d66"
          borderBottom="1px solid"
          borderColor="#dbe5f4"
        >
          <Box>
            <Heading size={{ base: "md", md: "lg" }} fontWeight="700">
              Comment Moderation
            </Heading>
            <Text mt={1} color="gray.600" fontSize={{ base: "sm", md: "md" }}>
              {user.name} ({user.email || "No email"})
            </Text>
          </Box>

          <Button
            variant="ghost"
            color="#2b4c7e"
            _hover={{ bg: "#e6eefb" }}
            onClick={onClose}
            aria-label="Close comments panel"
          >
            <FiX />
          </Button>
        </Flex>

        <Box p={{ base: 4, md: 6 }} overflowY="auto" maxH="calc(88vh - 104px)">
          {loading ? (
            <Flex py={16} justify="center" align="center" direction="column" gap={3}>
              <Spinner color="#4f79bd" size="lg" />
              <Text color="gray.600">Loading comments...</Text>
            </Flex>
          ) : groups.length === 0 ? (
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="14px"
              p={8}
              textAlign="center"
              bg="gray.50"
            >
              <Text fontWeight="600" color="gray.700">
                No comments found for this user.
              </Text>
            </Box>
          ) : (
            <Stack gap={5}>
              {groups.map((group) => (
                <Box
                  key={group.foodId}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="14px"
                  overflow="hidden"
                >
                  <Flex
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    gap={3}
                    p={4}
                    bg="#edf4ff"
                    direction={{ base: "column", md: "row" }}
                  >
                    <Heading size="sm" color="#2b4c7e" lineHeight="1.4">
                      {group.foodTitle}
                    </Heading>
                    <Badge bg="#4f79bd" color="white" px={3} py={1} borderRadius="full">
                      {group.comments.length} comment{group.comments.length > 1 ? "s" : ""}
                    </Badge>
                  </Flex>

                  <Separator borderColor="gray.200" />

                  <Stack p={4} gap={4}>
                    {group.comments.map((comment) => (
                      <Box
                        key={comment.comment_id}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="10px"
                        p={4}
                      >
                        <HStack justify="space-between" align="start" gap={3}>
                          <Box>
                            <Text color="gray.800" mb={2} lineHeight="1.7">
                              {comment.comment_text}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatDate(comment.createdAt)}
                            </Text>
                          </Box>

                          <Button
                            size="sm"
                            bg="red.50"
                            color="red.600"
                            _hover={{ bg: "red.100" }}
                            onClick={() => onDeleteComment(group.foodId, comment.comment_id)}
                            loading={deletingCommentId === comment.comment_id}
                          >
                            <FiTrash2 />
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
