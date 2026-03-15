import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  IconButton,
  Avatar,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiEdit2, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import { useUser } from "../../../context/UserProvider";
import {
  addComment,
  deleteComment,
  getCommentsByFood,
  updateComment,
} from "../../../services/api/comment.service";
import { addOrUpdateRating, getRatingsByFood } from "../../../services/api/rating.service";
import colors from "../../../theme/tokens";

const CommentSection = ({ foodId, comments = [], ratings = [] }) => {
  const { user } = useUser();
  const [localComments, setLocalComments] = useState(comments);
  const [localRatings, setLocalRatings] = useState(ratings);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [hoveredEditRating, setHoveredEditRating] = useState(0);
  const [actionMenuForCommentId, setActionMenuForCommentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  useEffect(() => {
    setLocalRatings(ratings || []);
  }, [ratings]);

  const reloadReviewData = async () => {
    const [updatedComments, updatedRatings] = await Promise.all([
      getCommentsByFood(foodId).catch(() => []),
      getRatingsByFood(foodId).catch(() => []),
    ]);

    setLocalComments(updatedComments || []);
    setLocalRatings(updatedRatings || []);
  };

  const handleSubmitComment = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if (hasReviewed) {
      alert("You already reviewed this recipe. Please edit your existing review.");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await addOrUpdateRating(foodId, newRating);

      await addComment(foodId, {
        comment_text: newComment.trim(),
        parent_id: null,
      });

      setNewComment("");
      setNewRating(5);

      await reloadReviewData();
    } catch (error) {
      console.error("Error submitting comment:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to submit comment";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const ratingByUser = localRatings.reduce((acc, rating) => {
    acc[rating.user_id] = Number(rating.rating || 0);
    return acc;
  }, {});

  const isOwnComment = (comment) => {
    if (!user?.email || !comment?.user?.email) return false;
    return user.email.toLowerCase() === String(comment.user.email).toLowerCase();
  };

  useEffect(() => {
    const currentEmail = String(user?.email || "").toLowerCase();
    const reviewed = (localComments || []).some((comment) => {
      if (comment?.parent_id != null) return false;
      const commentEmail = String(comment?.user?.email || "").toLowerCase();
      return Boolean(currentEmail) && currentEmail === commentEmail;
    });
    setHasReviewed(reviewed);
  }, [localComments, user]);

  const getDisplayName = (comment) => comment.user?.name || comment.userName || "Anonymous";

  const getCommentAvatarSrc = (comment) => {
    const commentImage = comment?.user?.image_url;
    if (commentImage) return commentImage;
    if (isOwnComment(comment)) return user?.photoURL || undefined;
    return undefined;
  };

  const getAvatarFallback = (name) => (name?.trim()?.charAt(0) || "A").toUpperCase();

  const formatRelativeTime = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Recently";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
    return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
  };

  const getEditedLabel = (comment) => {
    const createdAt = comment?.createdAt ? new Date(comment.createdAt) : null;
    const updatedAt = comment?.updatedAt ? new Date(comment.updatedAt) : null;

    if (!createdAt || !updatedAt || Number.isNaN(createdAt.getTime()) || Number.isNaN(updatedAt.getTime())) {
      return formatRelativeTime(comment?.createdAt);
    }

    const wasEdited = Math.abs(updatedAt.getTime() - createdAt.getTime()) > 60 * 1000;
    if (!wasEdited) {
      return formatRelativeTime(createdAt);
    }

    return `Edited ${formatRelativeTime(updatedAt)}`;
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditingText(comment.comment_text || "");
    setEditingRating(ratingByUser[comment.user_id] || 5);
    setHoveredEditRating(0);
    setActionMenuForCommentId(null);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
    setEditingRating(5);
    setHoveredEditRating(0);
    setActionMenuForCommentId(null);
  };

  const saveEditedComment = async (commentId) => {
    if (!editingText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await addOrUpdateRating(foodId, editingRating);
      await updateComment(commentId, { comment_text: editingText.trim() });
      cancelEditing();
      await reloadReviewData();
    } catch (error) {
      console.error("Error updating comment:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to update comment";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteComment(commentId);
      await reloadReviewData();
    } catch (error) {
      console.error("Error deleting comment:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to delete comment";
      alert(message);
    } finally {
      setLoading(false);
      setActionMenuForCommentId(null);
    }
  };

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
          {localRatings.length}
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
                  color={star <= (hoveredRating || newRating) ? "#FDB022" : "gray.300"}
                  boxSize="5"
                  cursor="pointer"
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  transition="transform 0.15s ease"
                  transform={star <= (hoveredRating || newRating) ? "scale(1.12)" : "scale(1)"}
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
            isDisabled={loading || hasReviewed}
            _hover={{ bg: colors.dark }}
          >
            {hasReviewed ? "You already reviewed (Edit below)" : "Post Comment"}
          </Button>

          {hasReviewed && (
            <Text mt="3" fontSize="sm" color="gray.600">
              Only one review is allowed per recipe to reduce spam. Edit your existing review from the options menu on your comment.
            </Text>
          )}
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
                key={comment.comment_id || idx}
                pb="4"
                _notLast={{ borderBottom: "1px solid", borderColor: "gray.200" }}
              >
                <Flex justify="space-between" align="flex-start" mb="2">
                  <Flex gap="3" align="flex-start">
                    <Avatar.Root shape="full" size="md">
                      <Avatar.Image src={getCommentAvatarSrc(comment)} />
                      <Avatar.Fallback>{getAvatarFallback(getDisplayName(comment))}</Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="600" color={colors.darkest}>
                        {getDisplayName(comment)}
                      </Text>

                      <HStack gap="1.5" mt="1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={`${comment.comment_id}-meta-star-${star}`}
                            as={FaStar}
                            boxSize="3"
                            color={star <= (ratingByUser[comment.user_id] || 0) ? "#FDB022" : "gray.300"}
                          />
                        ))}
                        <Text fontSize="12px" color="gray.500" ml="1">
                          {getEditedLabel(comment)}
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>

                  {isOwnComment(comment) && editingCommentId !== comment.comment_id && (
                    <Box position="relative">
                      <IconButton
                        aria-label="Comment actions"
                        size="sm"
                        variant="ghost"
                        color="gray.500"
                        onClick={() =>
                          setActionMenuForCommentId((prev) =>
                            prev === comment.comment_id ? null : comment.comment_id,
                          )
                        }
                      >
                        <FiMoreHorizontal />
                      </IconButton>

                      {actionMenuForCommentId === comment.comment_id && (
                        <Box
                          position="absolute"
                          right="0"
                          top="9"
                          bg="white"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          boxShadow="sm"
                          p="1"
                          zIndex="2"
                          minW="120px"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            width="100%"
                            justifyContent="flex-start"
                            leftIcon={<FiEdit2 />}
                            onClick={() => startEditing(comment)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            width="100%"
                            justifyContent="flex-start"
                            color="red.500"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeleteComment(comment.comment_id)}
                            isLoading={loading}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </Flex>

                {editingCommentId === comment.comment_id ? (
                  <Box>
                    <Textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focus={{ borderColor: colors.primary }}
                      mb="2"
                      minHeight="80px"
                    />

                    <Flex align="center" gap="2" mb="2">
                      <Text fontSize="sm" color="gray.600">
                        Rating:
                      </Text>
                      <HStack gap="1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={`edit-star-${star}`}
                            as={FaStar}
                            boxSize="4"
                            cursor="pointer"
                            color={star <= (hoveredEditRating || editingRating) ? "#FDB022" : "gray.300"}
                            onClick={() => setEditingRating(star)}
                            onMouseEnter={() => setHoveredEditRating(star)}
                            onMouseLeave={() => setHoveredEditRating(0)}
                            transition="transform 0.15s ease"
                            transform={star <= (hoveredEditRating || editingRating) ? "scale(1.12)" : "scale(1)"}
                          />
                        ))}
                      </HStack>
                    </Flex>

                    <HStack gap="2">
                      <Button
                        size="sm"
                        bg={colors.primary}
                        color="white"
                        onClick={() => saveEditedComment(comment.comment_id)}
                        isLoading={loading}
                        _hover={{ bg: colors.dark }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Box>
                    <Text color="gray.700" fontSize="14px">
                      {comment.comment_text || comment.content || comment.comment}
                    </Text>
                  </Box>
                )}
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
