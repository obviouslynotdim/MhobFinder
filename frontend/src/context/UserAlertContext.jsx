import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const UserAlertContext = createContext(null);

const toneStyles = {
  success: {
    border: "#86EFAC",
    bg: "#F0FDF4",
    title: "#15803D",
    text: "#16A34A",
    icon: <FiCheckCircle size={20} />,
  },
  error: {
    border: "#F87171",
    bg: "#FEF2F2",
    title: "#991B1B",
    text: "#B91C1C",
    icon: <FiAlertCircle size={20} />,
  },
  info: {
    border: "#93C5FD",
    bg: "#EFF6FF",
    title: "#1E40AF",
    text: "#1D4ED8",
    icon: <FiInfo size={20} />,
  },
};

export function UserAlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  const showAlert = useCallback((payload) => {
    const nextAlert = {
      tone: payload?.tone || "success",
      title: payload?.title || "Done",
      description: payload?.description || "",
      duration: payload?.duration ?? 3000,
    };

    setAlert(nextAlert);

    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    if (nextAlert.duration > 0) {
      alertTimeoutRef.current = setTimeout(() => {
        setAlert(null);
      }, nextAlert.duration);
    }
  }, []);

  const contextValue = useMemo(() => ({ showAlert }), [showAlert]);

  const alertTone = toneStyles[alert?.tone] || toneStyles.info;

  return (
    <UserAlertContext.Provider value={contextValue}>
      {children}

      {alert && (
        <Box
          position="fixed"
          top={{ base: "16px", md: "20px" }}
          left="50%"
          transform="translateX(-50%)"
          zIndex={1800}
          animation="slideDown 0.3s ease-out"
          sx={{
            '@keyframes slideDown': {
              from: { opacity: 0, transform: 'translateX(-50%) translateY(-20px)' },
              to: { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
            },
          }}
        >
          <Box
            px={{ base: 4, md: 5 }}
            py={{ base: 3, md: 4 }}
            border="1px solid"
            borderColor={alertTone.border}
            bg={alertTone.bg}
            borderRadius="12px"
            boxShadow="0 8px 24px rgba(15,23,42,0.12)"
            minW={{ base: "calc(100vw - 32px)", sm: "360px" }}
            maxW={{ base: "calc(100vw - 32px)", sm: "420px" }}
          >
            <HStack align="flex-start" gap={3}>
              <Box color={alertTone.text} flexShrink={0} pt={{ base: "2px", md: "3px" }}>
                {alertTone.icon}
              </Box>
              <VStack align="stretch" spacing={0.5} flex={1}>
                <Text
                  fontWeight="700"
                  color={alertTone.title}
                  fontSize={{ base: "sm", md: "sm" }}
                  lineHeight="1.4"
                >
                  {alert.title}
                </Text>
                {alert.description ? (
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color={alertTone.text}
                    lineHeight="1.5"
                  >
                    {alert.description}
                  </Text>
                ) : null}
              </VStack>
            </HStack>
          </Box>
        </Box>
      )}
    </UserAlertContext.Provider>
  );
}

export function useUserAlert() {
  const context = useContext(UserAlertContext);

  if (!context) {
    throw new Error("useUserAlert must be used within UserAlertProvider");
  }

  return context;
}
