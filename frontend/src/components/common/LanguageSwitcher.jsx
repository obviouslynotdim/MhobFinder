import { useEffect, useRef, useState } from "react";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { MdTranslate } from "react-icons/md";
import { useTranslation } from "../../context/useTranslation.js";

export default function LanguageSwitcher({
  iconColor = "white",
  hoverBg = "whiteAlpha.200",
  compact = false,
  showLabel = false,
}) {
  const { language, setLanguage, languages, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" ref={ref}>
      <IconButton
        aria-label={t("common.translationsAria")}
        variant="ghost"
        color={iconColor}
        _hover={{ bg: hoverBg }}
        onClick={() => setOpen((v) => !v)}
      >
        <MdTranslate />
      </IconButton>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          right="0"
          minW={compact ? "120px" : "150px"}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="lg"
          borderRadius="md"
          py="1"
          zIndex="20"
        >
          {Object.values(languages).map((item) => {
            const active = language === item.code;
            return (
              <HStack
                key={item.code}
                px="3"
                py="2"
                justify="space-between"
                cursor="pointer"
                bg={active ? "blue.50" : "white"}
                _hover={{ bg: active ? "blue.100" : "gray.50" }}
                onMouseDown={() => {
                  setLanguage(item.code);
                  setOpen(false);
                }}
              >
                <Text fontSize="sm" color="gray.800" fontWeight={active ? "700" : "500"}>
                  {item.label}
                </Text>
                {showLabel && (
                  <Text fontSize="xs" color="gray.500">
                    {item.shortLabel}
                  </Text>
                )}
              </HStack>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
