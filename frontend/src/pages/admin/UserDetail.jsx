import { Avatar, Box, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();

  const users = [
    { id: 1, name: "Ly Dara", phone: "+855 96 345 7821", gender: "Male", email: "lydara23@example.com", dob: "08 January 2000" },
    { id: 2, name: "Vixy", phone: "+855 12 345 678", gender: "Female", email: "vixy@example.com", dob: "15 March 2001" },
    { id: 3, name: "Salty", phone: "+855 88 222 333", gender: "Male", email: "salty@example.com", dob: "20 June 1999" },
    { id: 4, name: "Lemon", phone: "+855 77 444 555", gender: "Female", email: "lemon@example.com", dob: "05 May 2002" },
    { id: 5, name: "Lita", phone: "+855 66 333 111", gender: "Female", email: "lita@example.com", dob: "12 July 2000" },
  ];

  const user = users.find((u) => String(u.id) === id);

  if (!user) return <Box p={6}>User not found</Box>;

  return (
    <Box h="calc(100vh - 48px)" overflow="hidden" display="flex" justifyContent="center" alignItems="flex-start">
      <Box w="100%" maxW="820px" bg="#cfdaf0" borderRadius="24px" p={7}>
        <Heading size="lg" color="#4975BB">User Detail</Heading>

        <Separator my={6} borderColor="gray.300" />

        <Box border="2px solid" borderColor="gray.300" bg="#c8d4ea" borderRadius="12px" p={6}>
          <Heading size="md" color="white" bg="#4f79bd" p={4} mb={6}>
            User Details
          </Heading>

          <Stack direction={{ base: "column", md: "row" }} gap={6} align="start">
            <Avatar.Root size="2xl">
              <Avatar.Fallback name={user.name} />
            </Avatar.Root>

            <Stack gap={3}>
              <Text><b>Name:</b> {user.name}</Text>
              <Text><b>Email:</b> {user.email}</Text>
              <Text><b>Phone:</b> {user.phone}</Text>
              <Text><b>Gender:</b> {user.gender}</Text>
              <Text><b>Date of birth:</b> {user.dob}</Text>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
