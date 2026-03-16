import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

const AdminAlertContext = createContext(null);

const toneStyles = {
  success: {
    border: "#A7F3D0",
    bg: "#ECFDF5",
    title: "#065F46",
    text: "#047857",
  },
  error: {
    border: "#FECACA",
    bg: "#FEF2F2",
    title: "#B91C1C",
    text: "#475569",
  },
  warning: {
    border: "#E2E8F0",
    bg: "#F8FAFC",
    title: "#334155",
    text: "#475569",
  },
  info: {
    border: "#BFDBFE",
    bg: "#EFF6FF",
    title: "#1E3A8A",
    text: "#1D4ED8",
  },
};

export function AdminAlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const alertTimeoutRef = useRef(null);

  const showAlert = useCallback((payload) => {
    const nextAlert = {
      tone: payload?.tone || "success",
      title: payload?.title || "Done",
      description: payload?.description || "",
      duration: payload?.duration ?? 2400,
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

  const confirm = useCallback((payload) => {
    return new Promise((resolve) => {
      setConfirmState({
        tone: payload?.tone || "warning",
        title: payload?.title || "Are you sure?",
        description: payload?.description || "This action cannot be undone.",
        confirmLabel: payload?.confirmLabel || "Confirm",
        cancelLabel: payload?.cancelLabel || "Cancel",
        onResolve: resolve,
      });
    });
  }, []);

  const handleConfirmResolve = useCallback((value) => {
    setConfirmState((current) => {
      if (current?.onResolve) {
        current.onResolve(value);
      }
      return null;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ showAlert, confirm }),
    [showAlert, confirm],
  );

  const alertTone = toneStyles[alert?.tone] || toneStyles.info;
  const confirmTone = toneStyles[confirmState?.tone] || toneStyles.warning;
  const isDestructiveConfirm = confirmState?.tone === "error";

  return (
    <AdminAlertContext.Provider value={contextValue}>
      {children}

      {alert && (
        <Box
          position="fixed"
          top={{ base: "14px", md: "18px" }}
          left="50%"
          transform="translateX(-50%)"
          zIndex={1800}
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 3 }}
          border="1px solid"
          borderColor={alertTone.border}
          bg={alertTone.bg}
          borderRadius="14px"
          boxShadow="0 12px 30px rgba(15,23,42,0.16)"
          minW={{ base: "88vw", sm: "360px" }}
          maxW="520px"
        >
          <Text fontWeight="800" color={alertTone.title} fontSize="sm">
            {alert.title}
          </Text>
          {alert.description ? (
            <Text mt="1" fontSize="sm" color={alertTone.text}>
              {alert.description}
            </Text>
          ) : null}
        </Box>
      )}

      {confirmState && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(15,23,42,0.22)"
          zIndex={1900}
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          pt={{ base: "72px", md: "92px" }}
          px={3}
        >
          <VStack
            align="stretch"
            spacing={3}
            w="100%"
            maxW="460px"
            bg="white"
            borderRadius="16px"
            border="1px solid"
            borderColor={confirmTone.border}
            p={{ base: 4, md: 5 }}
            boxShadow="0 18px 45px rgba(15,23,42,0.2)"
          >
            <Text fontWeight="800" color={confirmTone.title} fontSize="md">
              {confirmState.title}
            </Text>
            <Text fontSize="sm" color={confirmTone.text}>
              {confirmState.description}
            </Text>
            <HStack justify="flex-end" pt={1}>
              <Button
                variant="ghost"
                onClick={() => handleConfirmResolve(false)}
              >
                {confirmState.cancelLabel}
              </Button>
              <Button
                bg={isDestructiveConfirm ? "#DC2626" : "#334155"}
                color="white"
                _hover={{ bg: isDestructiveConfirm ? "#B91C1C" : "#1E293B" }}
                onClick={() => handleConfirmResolve(true)}
              >
                {confirmState.confirmLabel}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </AdminAlertContext.Provider>
  );
}

export function useAdminAlert() {
  const context = useContext(AdminAlertContext);

  if (!context) {
    throw new Error("useAdminAlert must be used within AdminAlertProvider");
  }

  return context;
}
