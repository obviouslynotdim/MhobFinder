import { Box, Image, Text, Flex, Badge } from "@chakra-ui/react";
import colors from "../../../theme/tokens";

const MayLikeCard = ({
  title = "ABC Chicken Soup",
  image = "https://images.unsplash.com/photo-1667489022797-ab608913feeb",
  sharedIngredients = 3,
  totalIngredients = 8,
  onClick,
}) => {
  const matchPercentage = Math.round((sharedIngredients / totalIngredients) * 100);

  return (
    <Box
      display="flex"
      flexDirection="row"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      border={`1px solid ${colors.chipBg}`}
      height="120px"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <Box width="100px" height="100%" flexShrink="0">
        <Image
          objectFit="cover"
          width="100%"
          height="100%"
          src={image}
          alt={title}
        />
      </Box>

      {/* Content Container */}
      <Box
        p="3"
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden"
      >
        {/* Title */}
        <Box>
          <Text
            fontWeight="600"
            fontSize="14px"
            color={colors.darkest}
            noOfLines={2}
            lineHeight="1.4"
          >
            {title}
          </Text>
        </Box>

        {/* Match Badge */}
        <Flex align="center" gap="2">
          <Badge
            bg={colors.primary}
            color="white"
            fontSize="11px"
            fontWeight="600"
            borderRadius="md"
            px="2"
            py="1"
          >
            {matchPercentage}% Match
          </Badge>
          <Text fontSize="11px" color="gray.500">
            {sharedIngredients} shared ingredients
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default MayLikeCard;