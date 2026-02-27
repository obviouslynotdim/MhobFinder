import { Box, Image, Text, Badge, Center } from "@chakra-ui/react"

const MayLikeCard = ({ 
  title = "ABC Chicken Soup",
  source = "rotinrice.com",
  missingIngredients = "You're missing chicken breast, tomato, onion, peppercorn, carrot, potato",
  image = "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
}) => (
  <Center>
    <Box 
    display="flex" 
    flexDirection="row" 
    bg="white" 
    borderRadius="8px"
    overflow="hidden" 
    boxShadow="0 1px 3px rgba(0,0,0,0.1)"
    mb="12px"
    width="100%"
    maxWidth="90%"
    border="1px solid #e0e0e0"
    height="125px"
  >
    {/* Image container - fixed size */}
    <Box width="80px" height="100%" flexShrink="0">
      <Image
        objectFit="cover"
        width="100%"
        height="100%"
        src={image}
        alt={title}
      />
    </Box>
    
    {/* Text container */}
    <Box 
      p="8px 12px" 
      flex="1" 
      display="flex" 
      flexDirection="column" 
      justifyContent="space-between"
      overflow="hidden"
    >
      {/* Title and source */}
      <Box>
        <Text 
          fontWeight="600" 
          fontSize="14px" 
          color="#333"
          noOfLines={1}
          mb="2px"
        >
          {title}
        </Text>
        
        <Text fontSize="12px" color="#666" mb="4px">
          {source}
        </Text>
      </Box>
      
      {/* Missing ingredients */}
      <Text 
        fontSize="11px" 
        color="#888"
        noOfLines={2}
        lineHeight="1.3"
        mb="4px"
      >
        {missingIngredients}
      </Text>
      
      {/* View Recipe badge */}
      <Box>
        <Badge 
          bg="transparent"
          color="#3182ce"
          fontSize="11px"
          fontWeight="500"
          border="1px solid #3182ce"
          borderRadius="12px"
          px="8px"
          py="1px"
        >
          View Recipe
        </Badge>
      </Box>
    </Box>
  </Box>
  </Center>
)

export default MayLikeCard;