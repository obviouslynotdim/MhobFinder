import { useEffect, useRef, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { colors } from "../theme/tokens.js";

/**
 * A standalone category filter dropdown.
 *
 * Props:
 *   options          {Array<{ name: string, foodIds: Set|null }>}
 *   selectedCategory {string}
 *   onChange         {function(name: string)}
 */
export default function CategoryDropdown({ options, selectedCategory, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" ref={ref}>
      <Button
        variant="outline"
        bg="white"
        borderColor={colors.primary}
        color={colors.dark}
        _hover={{ bg: colors.chipBg }}
        rightIcon={<FiChevronDown size={16} />}
        onClick={() => setOpen((v) => !v)}
        size="sm"
      >
        Category: {selectedCategory}
      </Button>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          right="0"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          minW="200px"
          zIndex="10"
          py="1"
        >
          {options.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <Box
                key={cat.name}
                px="4"
                py="2"
                cursor="pointer"
                fontSize="sm"
                fontWeight={active ? "semibold" : "normal"}
                color={active ? colors.primary : "inherit"}
                bg={active ? colors.chipBg : "white"}
                _hover={{ bg: active ? colors.chipHover : "gray.50" }}
                onMouseDown={() => {
                  onChange(cat.name);
                  setOpen(false);
                }}
              >
                {cat.name}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
