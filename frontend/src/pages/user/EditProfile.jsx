import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserAlert } from "../../context/UserAlertContext.jsx";
import { useUser } from "../../context/UserProvider.jsx";
import { colors } from "../../theme/tokens.js";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

export default function EditProfile() {
  const { user, loading, updateUserProfile } = useUser();
  const { showAlert } = useUserAlert();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPreviewUrl(user.photoURL || "");
  }, [user]);

  useEffect(() => {
    if (!selectedImage) return;
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleSelectImage = (file) => {
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setMessage("Please choose an image file only.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be 5MB or smaller.");
      return;
    }

    setSelectedImage(file);
    setMessage("");
  };

  const handleSaveProfile = async () => {
    if (saving) return;

    setMessage("");

    const trimmedName = String(name || "").trim();
    const currentName = String(user?.name || "").trim();
    const changedName = Boolean(trimmedName) && trimmedName !== currentName;
    const changedImage = Boolean(selectedImage);

    if (!changedName && !changedImage) {
      setMessage("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        name: changedName ? trimmedName : "",
        imageFile: changedImage ? selectedImage : null,
      });
      setSelectedImage(null);

      const successDescription = changedName && changedImage
        ? "Your name and photo were saved successfully."
        : changedName
          ? "Your name was saved successfully."
          : "Your photo was saved successfully.";

      showAlert({
        tone: "success",
        title: "Profile updated",
        description: successDescription,
      });
      navigate("/profile");
    } catch (error) {
      const msg =
        error?.response?.data?.error || error?.message || "Failed to update profile.";
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(user?.photoURL || "");
  };

  if (loading) {
    return (
      <AppLoadingState
        title="Loading profile"
        description="Preparing your profile editor."
        minH="320px"
      />
    );
  }

  if (!user) {
    return (
      <Box p={{ base: 8, md: 10 }} textAlign="center">
        <VStack gap="4">
          <Text color={colors.dark}>Please log in to edit your profile.</Text>
          <Button
            onClick={() => navigate("/login")}
            bg={colors.primary}
            color="white"
            _hover={{ bg: colors.dark }}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={{ base: 6, md: 10 }} maxW="560px" mx="auto">
      <Box
        bg="white"
        border="1px solid"
        borderColor="#CFE0FA"
        borderRadius="2xl"
        p="8"
        boxShadow="0 14px 35px rgba(43,76,126,0.12)"
      >
        <VStack gap="5" align="center">
          <HStack w="full" justify="space-between" align="center">
            <IconButton
              aria-label="Back to profile"
              variant="ghost"
              color={colors.darkest}
              _hover={{ bg: colors.chipBg }}
              onClick={() => navigate("/profile")}
              isDisabled={saving}
            >
              <FiArrowLeft />
            </IconButton>

            <Text fontWeight="800" fontSize="2xl" color={colors.darkest}>
              Edit Profile
            </Text>

            <Box w="40px" />
          </HStack>

          <Avatar.Root size="2xl">
            <Avatar.Image src={previewUrl || user.photoURL} />
            <Avatar.Fallback name={user.name} bg={colors.primary} color="white" />
          </Avatar.Root>

          <VStack w="full" gap="3" align="stretch" pt="2">
            <Box>
              <Text mb="1" fontSize="sm" color={colors.dark}>
                Display Name
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg="white"
                borderColor="#CFE0FA"
                _focusVisible={{ borderColor: colors.primary }}
                isDisabled={saving}
              />
            </Box>

            <Box>
              <Text mb="1" fontSize="sm" color={colors.dark}>
                Profile Image
              </Text>
              <Box
                border="2px dashed"
                borderColor={isDragging ? colors.primary : "#BFD3F3"}
                borderRadius="xl"
                px={{ base: 4, md: 5 }}
                py="6"
                bg={isDragging ? "#EDF4FF" : "#F8FBFF"}
                transition="all 0.2s ease"
                cursor={saving ? "not-allowed" : "pointer"}
                opacity={saving ? 0.7 : 1}
                onClick={() => {
                  if (saving) return;
                  fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  if (saving) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragEnter={(e) => {
                  if (saving) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  if (saving) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  if (saving) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  handleSelectImage(e.dataTransfer?.files?.[0] || null);
                }}
              >
                <VStack gap="2" textAlign="center">
                  <Text fontSize="sm" fontWeight="700" color={colors.darkest}>
                    Drag and drop your image here
                  </Text>
                  <Text fontSize="xs" color={colors.dark}>
                    or click to browse (PNG, JPG, WEBP up to 5MB)
                  </Text>
                  {selectedImage && (
                    <Text fontSize="xs" color={colors.primary} fontWeight="600">
                      Selected: {selectedImage.name}
                    </Text>
                  )}
                </VStack>

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSelectImage(e.target.files?.[0] || null)}
                  display="none"
                  disabled={saving}
                />
              </Box>

              {selectedImage && (
                <Button
                  mt="2"
                  size="sm"
                  variant="outline"
                  borderColor="#BFD3F3"
                  onClick={clearSelectedImage}
                  isDisabled={saving}
                >
                  Remove Selected Image
                </Button>
              )}
            </Box>

            {saving && (
              <Text fontSize="sm" color={colors.dark}>
                Saving profile changes. Please wait...
              </Text>
            )}

            {message && (
              <Text
                fontSize="sm"
                color={message.toLowerCase().includes("success") ? "green.600" : "red.500"}
              >
                {message}
              </Text>
            )}

            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
              gap="3"
            >
              <Button
                variant="outline"
                borderColor={colors.primary}
                color={colors.dark}
                _hover={{ bg: colors.chipBg }}
                onClick={() => navigate("/profile")}
                isDisabled={saving}
              >
                Cancel
              </Button>

              <Button
                bg={colors.primary}
                color="white"
                _hover={{ bg: colors.dark }}
                onClick={handleSaveProfile}
                isLoading={saving}
                loadingText="Saving..."
                isDisabled={saving}
              >
                Save Profile
              </Button>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
