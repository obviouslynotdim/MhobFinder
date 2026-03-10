import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Icon,
  Avatar,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import { useUser } from "../../../context/UserProvider";
import { addComment } from "../../../services/api/comment.service";
import { addOrUpdateRating } from "../../../services/api/rating.service";
import colors from "../../../theme/tokens";

const CommentSection = ({ foodId, comments = [], ratings = [] }) => {
  const { user } = useUser();
  const [localComments, setLocalComments] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await addComment(foodId, {
        content: newComment,
        rating: newRating,
      });

      setNewComment("");
      setNewRating(5);

      // Refetch comments
      const response = await fetch(`/api/comments/foods/${foodId}`, {
        credentials: "include",
      });
      const updatedComments = await response.json();
      setLocalComments(updatedComments || []);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <Box w="100%" bg="white" p="6" borderRadius="lg" boxShadow="sm">
      {/* Header */}
      <Flex align="center" gap="3" mb="6">
        <Text fontSize="lg" fontWeight="bold" color={colors.darkest}>
          Reviews & Comments
        </Text>
        <Box
          bg={colors.primary}
          px="3"
          py="1"
          borderRadius="lg"
          color="white"
          fontWeight="bold"
          fontSize="sm"
        >
          {ratings.length}
        </Box>
      </Flex>

      {/* Add Comment Section */}
      {user ? (
        <Box bg={colors.chipBg} p="4" borderRadius="lg" mb="6">
          <Flex align="center" gap="3" mb="4">
            <Avatar.Root shape="full" size="md">
              <Avatar.Image src={user.photoURL || "https://picsum.photos/200"} />
            </Avatar.Root>
            <Box>
              <Text fontWeight="600" color={colors.darkest}>
                {user.name}
              </Text>
            </Box>
          </Flex>

          <Textarea
            placeholder="Share your thoughts about this recipe..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            borderRadius="lg"
            borderColor="gray.300"
            _focus={{ borderColor: colors.primary }}
            mb="3"
            resize="vertical"
            minHeight="80px"
          />

          {/* Rating Stars */}
          <Flex align="center" gap="2" mb="3">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Your rating:
            </Text>
            <HStack gap="1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={FaStar}
                  color={star <= newRating ? "#FDB022" : "gray.300"}
                  boxSize="5"
                  cursor="pointer"
                  onClick={() => setNewRating(star)}
                  _hover={{ color: "#FDB022" }}
                />
              ))}
            </HStack>
          </Flex>

          <Button
            bg={colors.primary}
            color="white"
            fontWeight="600"
            width="100%"
            onClick={handleSubmitComment}
            isLoading={loading}
            _hover={{ bg: colors.dark }}
          >
            Post Comment
          </Button>
        </Box>
      ) : (
        <Text color="gray.500" fontSize="sm" mb="6" textAlign="center">
          Please login to leave a comment
        </Text>
      )}

      {/* Comments List */}
      <Box>
        {localComments.length > 0 ? (
          <Flex direction="column" gap="4">
            {localComments.map((comment, idx) => (
              <Box
                key={idx}
                pb="4"
                _notLast={{ borderBottom: "1px solid", borderColor: "gray.200" }}
              >
                <Flex justify="space-between" align="flex-start" mb="2">
                  <Flex gap="3" align="flex-start">
                    <Avatar.Root shape="full" size="md">
                      <Avatar.Image src={comment.userPhotoURL || "https://picsum.photos/200"} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="600" color={colors.darkest}>
                        {comment.userName || "Anonymous"}
                      </Text>
                      <Text fontSize="12px" color="gray.500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : "Recently"}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="center" gap="2" color="gray.500">
                    <Icon as={FaThumbsUp} boxSize="4" />
                    <Text fontSize="sm">{comment.likes || 0}</Text>
                  </Flex>
                </Flex>

                {/* Rating Stars */}
                <HStack gap="1" mb="2">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      as={FaStar}
                      color={i < Math.round(comment.rating) ? "#FDB022" : "gray.300"}
                      boxSize="3"
                    />
                  ))}
                </HStack>

                <Text color="gray.700" fontSize="14px">
                  {comment.content || comment.comment}
                </Text>
              </Box>
            ))}
          </Flex>
        ) : (
          <Text color="gray.500" fontSize="14px" textAlign="center">
            No comments yet. Be the first to comment!
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
