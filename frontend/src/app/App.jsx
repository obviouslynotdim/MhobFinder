import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Text, SimpleGrid, Button, Image, HStack, VStack, Badge } from "@chakra-ui/react";
import mhobBackground from "../assets/mhob-background.png";

const API = "http://localhost:5000";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foods, setFoods] = useState([]);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/ingredients`).then(res => setIngredients(res.data));
    axios.get(`${API}/api/foods`).then(res => setFoods(res.data));
  }, []);

  const toggleIngredient = (id) => {
    const newSelected = selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id];
    setSelected(newSelected);
    axios.post(`${API}/api/foods/match`, { ingredients: newSelected }).then(res => setFoods(res.data));
  };

  return (
    <Flex h="100vh" bg="#F7FAFC">
      {/* Sidebar */}
      <Box w="320px" bg="#D0E2FF" p={6} boxShadow="xl" zIndex={10}>
        <HStack mb={8} gap={3}>
          <Box bg="blue.600" p={2} borderRadius="lg" color="white">🍲</Box>
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="xl" color="blue.900">MhobFinder</Text>
            <Text fontSize="xs" color="gray.600">You have {selected.length} ingredients</Text>
          </VStack>
        </HStack>

        <Text fontWeight="bold" mb={4}>Pantry Essentials</Text>
        <HStack wrap="wrap" gap={3}>
          {ingredients.map(item => (
            <Box
              key={item.ingredient_id} px={3} py={1} cursor="pointer" borderRadius="full"
              bg={selected.includes(item.ingredient_id) ? "green.500" : "white"}
              color={selected.includes(item.ingredient_id) ? "white" : "gray.700"}
              border="1px solid" borderColor="gray.200" fontSize="sm"
              onClick={() => toggleIngredient(item.ingredient_id)}
            >
              {item.name}
            </Box>
          ))}
        </HStack>
      </Box>

      {/* Main Content Area with Custom Pattern Overlay */}
      <Box 
        flex="1" 
        overflowY="auto" 
        bgImage={`url(${mhobBackground})`}
        bgRepeat="repeat" 
        bgSize="400px" 
        bgColor="gray.50"
      >
        {showLanding ? (
          /* Landing Page View */
          <Flex h="full" align="center" justify="center">
            <VStack bg="white" p={12} borderRadius="3xl" boxShadow="2xl" spacing={6} textAlign="center">
              <Image src="https://cdn-icons-png.flaticon.com/512/2276/2276931.png" boxSize="150px" />
              <Text fontSize="3xl" fontWeight="black" color="blue.600">MhobFinder</Text>
              <Button colorPalette="blue" size="xl" px={10} borderRadius="2xl" onClick={() => setShowLanding(false)}>
                Get Started
              </Button>
              <Text fontSize="sm" color="blue.400" cursor="pointer">Already have an account?</Text>
            </VStack>
          </Flex>
        ) : (
          
          <Box p={10}>
            <HStack justify="space-between" mb={8}>
              <Text fontSize="3xl" fontWeight="bold">Dinner Ideas</Text>
              <Button variant="ghost" colorPalette="blue" onClick={() => setSelected([])}>Clear All</Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
              {foods.map(food => (
                <Box key={food.food_id} bg="white" borderRadius="2xl" overflow="hidden" boxShadow="md" display="flex" flexDirection="column">
                  <Image src={food.image_url} w="full" h="200px" objectFit="cover" />
                                   
                  <VStack align="start" p={5} gap={2} w="full" minW="0">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>{food.title}</Text>
                    <HStack gap={2}>
                      <Badge colorPalette="blue" variant="subtle">{food.time}</Badge>
                      <Badge colorPalette="purple" variant="subtle">{food.category}</Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" noOfLines={2} h="32px">
                      Matched: {food.matched}
                    </Text>
                    <Button colorPalette="blue" size="sm" borderRadius="xl" mt={2} width="full" variant="outline">
                      View Full Recipe
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            
          </Box>
        )}
      </Box>
    </Flex>
  );
}

export default App;