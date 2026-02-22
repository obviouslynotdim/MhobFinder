import { Box, Heading, Text, Icon, Flex } from "@chakra-ui/react" // Make sure Icon is imported
import { FaHeart, FaStar, FaClock } from "react-icons/fa"

const OverlayBox = ({ 
  title = "Deviled Eggs", 
  hasAllIngredients = true,
  rating = 4.5,
  time = "30 mins",
  isFavorite = false
}) => {
  return (
    <Box
      p="3"
      borderWidth="1px"
      borderColor="gray.300"
      color="gray.800"
      bg="white"
      borderRadius="xl"
      position="relative"
      boxShadow="sm"
    >
      {/* Heart icon */}
      <Icon
        as={FaHeart}
        boxSize="4"
        color={isFavorite ? "red.400" : "gray.400"}
        cursor="pointer"
        position="absolute"
        top="3"
        right="3"
        _hover={{ color: "red.400" }}
      />
      
      <Heading size="md" pr="8">{title}</Heading>
      
      <Text 
        color={hasAllIngredients ? "green.600" : "red.600"} 
        fontSize="xs"
        fontWeight="medium" 
        mt="1"
      >
        {hasAllIngredients ? "✓ You have all the ingredients" : "✗ Missing some ingredients"}
      </Text>
      
      <Box 
        borderTop="1px solid" 
        borderColor="gray.300" 
        my="3"
      />
      
      <Flex justify="space-between" align="center" mt="3">
        <Flex align="center" gap="1">
          <Icon as={FaStar} color="yellow.400" boxSize="3" />
          <Text fontWeight="medium" fontSize="sm">{rating}</Text>
          <Text color="gray.500" fontSize="xs">★★★★★</Text>
        </Flex>
        
        <Flex align="center" gap="1">
          <Icon as={FaClock} color="gray.500" boxSize="3" />
          <Text color="gray.600" fontSize="sm">{time}</Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OverlayBox;