import { Box, SimpleGrid, Text, VStack, Image } from "@chakra-ui/react";

const TEAM = [
  {
    name: "Sokha",
    role: "Frontend",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dara",
    role: "Backend",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Maly",
    role: "UI/UX",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vannak",
    role: "Product",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
];

function TeamCard({ name, role, img }) {
  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      position="relative"
    >
      <Image src={img} alt={name} w="full" h="280px" objectFit="cover" />
      <Box position="absolute" left="0" right="0" bottom="0" bg="#C78B6B" p="4">
        <Text color="white" fontWeight="bold" fontSize="lg">
          {name}
        </Text>
        <Text color="whiteAlpha.900" fontSize="sm">
          {role}
        </Text>
      </Box>
    </Box>
  );
}

export default function About() {
  return (
    <Box p={{ base: 4, md: 6 }}>
      <VStack align="start" gap="1" mb="5">
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          About Us
        </Text>
        <Text fontSize="sm" opacity="0.75">
          A simple team section styled like the video.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
        {TEAM.map((m) => (
          <TeamCard key={m.name} {...m} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
