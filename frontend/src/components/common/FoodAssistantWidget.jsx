import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiMap,
  FiHelpCircle,
  FiShoppingCart,
  FiMoreVertical,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../../theme/tokens.js";

const ALLOWED_KEYWORDS = [
  "food",
  "recipe",
  "recipes",
  "ingredient",
  "ingredients",
  "cook",
  "cooking",
  "favorite",
  "favorites",
  "home",
  "profile",
  "category",
  "categories",
  "comment",
  "rating",
  "admin",
  "user",
  "search",
  "add",
  "edit",
  "delete",
  "help",
  "guide",
  "lost",
  "navigate",
];

const MESSAGE_COOLDOWN_MS = 900;
const BURST_WINDOW_MS = 10000;
const MAX_MESSAGES_PER_WINDOW = 5;
const ASSISTANT_TYPING_DELAY_MS = 650;

function isFoodOrAppRelated(input) {
  const normalized = String(input || "").toLowerCase();
  return ALLOWED_KEYWORDS.some((word) => normalized.includes(word));
}

function getRouteHint(pathname) {
  if (pathname.startsWith("/admin/foods")) {
    return "You are in Food Management. You can search foods, select multiple, and open recipes with View Recipe.";
  }
  if (pathname.startsWith("/admin/add-food")) {
    return "You are in Add Food. Fill title, description, category, ingredients, then upload image and submit.";
  }
  if (pathname.startsWith("/admin/edit-food")) {
    return "You are in Edit Food. Update recipe details and save, or delete from the danger zone.";
  }
  if (pathname.startsWith("/admin/manage-user")) {
    return "You are in Manage User. You can moderate comments and delete problematic accounts.";
  }
  if (pathname.startsWith("/favorites")) {
    return "You are in Favorites. Open saved recipes and remove any you no longer need.";
  }
  if (pathname.startsWith("/profile")) {
    return "You are in Profile. You can edit your account details and avatar.";
  }
  if (pathname.startsWith("/home")) {
    return "You are on Home. Pick ingredients from the sidebar to discover matching recipes.";
  }
  return "You can start from Home, choose ingredients, and open recipes that match what you have.";
}

function buildAssistantReply(message, pathname) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();

  if (!text) {
    return "Ask me about recipes, ingredients, favorites, or where to navigate next.";
  }

  if (!isFoodOrAppRelated(lower)) {
    return "I can only help with food recipes and MhobFinder navigation. Try asking about ingredients, categories, favorites, or managing recipes.";
  }

  if (lower.includes("lost") || lower.includes("where") || lower.includes("start")) {
    return getRouteHint(pathname);
  }

  if (lower.includes("guide") || lower.includes("help") || lower.includes("navigate")) {
    return `${getRouteHint(pathname)} Next step: select ingredients first, then open a recipe card and tap View Recipe.`;
  }

  if (lower.includes("favorite")) {
    return "To save favorites, open a recipe card and tap the heart icon. Your saved foods appear in Favorites.";
  }

  if (lower.includes("ingredient")) {
    return "Select ingredients from the sidebar first. The Home page will show recipes that match what you selected.";
  }

  if (lower.includes("category") || lower.includes("search")) {
    return "Use the category dropdown and search fields to narrow recipes quickly. Then open View Recipe for full details.";
  }

  if (lower.includes("add") || lower.includes("edit") || lower.includes("delete")) {
    return "Admin recipe actions are in Food Management: Add Food, Edit Food, and Delete with confirmation.";
  }

  return "I can help with recipe discovery, ingredient matching, favorites, and food management actions.";
}

export default function FoodAssistantWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am your Food Assistant. I can guide you around MhobFinder and answer food-related questions.",
    },
  ]);
  const [messageTimestamps, setMessageTimestamps] = useState([]);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [rateNotice, setRateNotice] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const replyTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const hidden = useMemo(
    () => location.pathname === "/" || location.pathname === "/login",
    [location.pathname],
  );

  // Keep menu visible when hovering or menu is open (but not when chat is open)
  const showMenuButtons = menuHovered || menuOpen;

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isRateLimited = () => {
    const now = Date.now();
    const recent = messageTimestamps.filter(
      (timestamp) => now - timestamp < BURST_WINDOW_MS,
    );

    if (isTyping) {
      return {
        limited: true,
        notice: "Please wait for the assistant response.",
      };
    }

    if (now < cooldownUntil) {
      return {
        limited: true,
        notice: "Please wait a moment before sending another message.",
      };
    }

    if (recent.length >= MAX_MESSAGES_PER_WINDOW) {
      return {
        limited: true,
        notice: "You are sending too fast. Please wait about 10 seconds.",
      };
    }

    return { limited: false, recent };
  };

  const queueAssistantReply = (replyText) => {
    setIsTyping(true);
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: replyText }]);
      setIsTyping(false);
    }, ASSISTANT_TYPING_DELAY_MS);
  };

  const registerMessageSend = (recent) => {
    const now = Date.now();
    setCooldownUntil(now + MESSAGE_COOLDOWN_MS);
    setMessageTimestamps([...(recent || []), now]);
  };

  const sendMessage = (rawMessage) => {
    const message = String(rawMessage || "").trim();
    if (!message) return;

    const limiter = isRateLimited();
    if (limiter.limited) {
      setRateNotice(limiter.notice);
      return;
    }

    registerMessageSend(limiter.recent);
    setRateNotice("");

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    const reply = buildAssistantReply(message, location.pathname);
    queueAssistantReply(reply);
    setInput("");
  };

  const quickGuide = () => {
    const limiter = isRateLimited();
    if (limiter.limited) {
      setRateNotice(limiter.notice);
      return;
    }

    registerMessageSend(limiter.recent);
    setRateNotice("");

    const reply = getRouteHint(location.pathname);
    queueAssistantReply(reply);
  };

  const quickStartGuide = () => {
    const limiter = isRateLimited();
    if (limiter.limited) {
      setRateNotice(limiter.notice);
      return;
    }

    registerMessageSend(limiter.recent);
    setRateNotice("");

    queueAssistantReply(
      "Quick guide: 1) Go to Home. 2) Pick ingredients from sidebar. 3) Open a recipe card. 4) Save favorites with the heart icon.",
    );
  };

  if (hidden) return null;

  return (
    <>
      {open && (
        <Box
          position="fixed"
          right={{ base: "14px", md: "22px" }}
          bottom={{ base: "84px", md: "94px" }}
          w={{ base: "calc(100vw - 28px)", sm: "360px" }}
          maxW="360px"
          border="1px solid"
          borderColor="#dbe5f4"
          borderRadius="18px"
          bg="white"
          boxShadow="0 20px 40px rgba(15,23,42,0.22)"
          zIndex={1700}
          overflow="hidden"
          animation="slideInLeft 0.3s ease-out"
          sx={{
            "@keyframes slideInLeft": {
              from: {
                transform: "translateX(400px)",
                opacity: 0,
              },
              to: {
                transform: "translateX(0)",
                opacity: 1,
              },
            },
          }}
        >
          <HStack
            justify="space-between"
            px={4}
            py={3}
            bg={colors.primary}
            color="white"
          >
            <HStack gap={2}>
              <FiMessageCircle />
              <Text fontWeight="700">Food Assistant</Text>
            </HStack>
            <IconButton
              aria-label="Close assistant"
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
              _active={{ bg: "rgba(255, 255, 255, 0.3)" }}
              transition="background 0.2s"
              onClick={() => {
                setOpen(false);
                setMenuOpen(false);
                setMessages([
                  {
                    role: "assistant",
                    text: "Hi, I am your Food Assistant. I can guide you around MhobFinder and answer food-related questions.",
                  },
                ]);
                setInput("");
                setRateNotice("");
              }}
            >
              <FiX />
            </IconButton>
          </HStack>

          <VStack align="stretch" gap={2} p={3} maxH="320px" overflowY="auto">
            {messages.map((msg, index) => (
              <Box
                key={`${msg.role}-${index}`}
                alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                bg={msg.role === "user" ? colors.primary : "#f5f8ff"}
                color={msg.role === "user" ? "white" : colors.darkest}
                borderRadius="14px"
                px={3}
                py={2}
                maxW="92%"
              >
                <Text fontSize="sm" lineHeight="1.5">
                  {msg.text}
                </Text>
              </Box>
            ))}

            {isTyping ? (
              <Box
                alignSelf="flex-start"
                bg="#f5f8ff"
                color={colors.darkest}
                borderRadius="14px"
                px={3}
                py={2}
                maxW="92%"
              >
                <Text fontSize="sm" lineHeight="1.5" opacity={0.8}>
                  Food Assistant is typing...
                </Text>
              </Box>
            ) : null}
            <div ref={messagesEndRef} />
          </VStack>

          <HStack px={3} pb={2} pt={1} gap={2}>
            <Button
              size="xs"
              variant="outline"
              borderColor="#dbe5f4"
              leftIcon={<FiMap />}
              onClick={quickGuide}
            >
              I am lost
            </Button>
            <Button
              size="xs"
              variant="outline"
              borderColor="#dbe5f4"
              onClick={quickStartGuide}
            >
              Quick Guide
            </Button>
            <Button
              size="xs"
              variant="outline"
              borderColor="#dbe5f4"
              leftIcon={<FiHelpCircle />}
              onClick={() => navigate("/home")}
            >
              Go Home
            </Button>
          </HStack>

          {rateNotice ? (
            <Text px={3} pb={1} fontSize="xs" color="orange.600">
              {rateNotice}
            </Text>
          ) : null}

          <HStack p={3} pt={2} borderTop="1px solid" borderColor="#edf2fb" gap={2}>
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask food or recipe questions..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage(input);
                }
              }}
              size="sm"
              borderRadius="full"
            />
            <IconButton
              aria-label="Send message"
              bg={colors.primary}
              color="white"
              _hover={{ bg: colors.dark }}
              borderRadius="full"
              size="sm"
              onClick={() => sendMessage(input)}
            >
              <FiSend />
            </IconButton>
          </HStack>
        </Box>
      )}

      {/* Main Button with Hover Menu */}
      <Box
        position="fixed"
        right={{ base: "14px", md: "22px" }}
        bottom={{ base: "18px", md: "22px" }}
        zIndex={1701}
        onMouseEnter={() => setMenuHovered(true)}
        onMouseLeave={() => setMenuHovered(false)}
        h="180px"
        w="48px"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
      >
        {/* Hover Menu - Chat Assistant Button */}
        <IconButton
          aria-label="Chat Assistant"
          position="absolute"
          right={0}
          bottom="56px"
          boxSize="40px"
          borderRadius="full"
          bg={colors.primary}
          color="white"
          _hover={{ bg: colors.dark }}
          boxShadow="0 8px 20px rgba(15,23,42,0.2)"
          opacity={showMenuButtons ? 1 : 0}
          transform={showMenuButtons ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)"}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          pointerEvents={showMenuButtons ? "auto" : "none"}
          onClick={() => {
            setOpen(true);
            setMenuOpen(false);
          }}
          title="Chat Assistant"
        >
          <FiMessageCircle size={18} />
        </IconButton>

        {/* Hover Menu - Cart Button */}
        <IconButton
          aria-label="Cart"
          position="absolute"
          right="0"
          bottom="104px"
          boxSize="40px"
          borderRadius="full"
          bg={colors.primary}
          color="white"
          _hover={{ bg: colors.dark }}
          boxShadow="0 8px 20px rgba(15,23,42,0.2)"
          opacity={showMenuButtons ? 1 : 0}
          transform={showMenuButtons ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)"}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          pointerEvents={showMenuButtons ? "auto" : "none"}
          isDisabled={true}
          title="Cart (Future Feature)"
        >
          <FiShoppingCart size={18} />
        </IconButton>

        {/* Main Button - General Menu */}
        <IconButton
          aria-label="General menu"
          boxSize="48px"
          borderRadius="full"
          bg={colors.primary}
          color="white"
          _hover={{ bg: colors.dark }}
          boxShadow="0 12px 24px rgba(15,23,42,0.25)"
          transition="all 0.2s"
          transform={showMenuButtons ? "scale(1.05)" : "scale(1)"}
          position="relative"
          zIndex={10}
          title={menuOpen ? "Close menu" : "Menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={16} /> : <FiMoreVertical size={16} />}
        </IconButton>
      </Box>
    </>
  );
}
