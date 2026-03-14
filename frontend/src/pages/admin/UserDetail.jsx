import { Box, Heading, Separator } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import UserDetailHeader from "../../components/admin/userDetail/UserDetailHeader";
import UserProfile from "../../components/admin/userDetail/UserProfile";
import UserInfoFields from "../../components/admin/userDetail/UserInfoFields";

export default function UserDetail() {
    const { id } = useParams();

    const users = [
        {
            id: 1,
            name: "Ly Dara",
            phone: "+855 96 345 7821",
            gender: "Male",
            email: "lydara23@example.com",
            dob: "08 January 2000",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 2,
            name: "Vixy",
            phone: "+855 12 345 678",
            gender: "Female",
            email: "vixy@example.com",
            dob: "15 March 2001",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 3,
            name: "Salty",
            phone: "+855 88 222 333",
            gender: "Male",
            email: "salty@example.com",
            dob: "20 June 1999",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 4,
            name: "Lemon",
            phone: "+855 77 444 555",
            gender: "Female",
            email: "lemon@example.com",
            dob: "05 May 2002",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 5,
            name: "Lita",
            phone: "+855 66 333 111",
            gender: "Female",
            email: "lita@example.com",
            dob: "12 July 2000",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 6,
            name: "Norin",
            phone: "+855 99 777 888",
            gender: "Male",
            email: "norin@example.com",
            dob: "18 December 1998",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 7,
            name: "Anna",
            phone: "+855 11 234 567",
            gender: "Female",
            email: "anna@example.com",
            dob: "02 February 2001",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 8,
            name: "Bella",
            phone: "+855 22 555 444",
            gender: "Female",
            email: "bella@example.com",
            dob: "14 April 2000",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 9,
            name: "James",
            phone: "+855 33 888 999",
            gender: "Male",
            email: "james@example.com",
            dob: "09 September 1997",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
        {
            id: 10,
            name: "John",
            phone: "+855 44 123 789",
            gender: "Male",
            email: "john@example.com",
            dob: "25 October 1996",
            avatar: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
        },
    ];

    const user = users.find((u) => String(u.id) === id);

    if (!user) return <Box p={6}>User not found</Box>;

    return (
        <Box
            h="calc(100vh - 90px - 48px)"
            overflow="hidden"
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                w="100%"
                maxW="820px"
                bg="#cfdaf0"
                borderRadius="24px"
                p={7}
            >
                <UserDetailHeader />

                <Separator mb={6} borderColor="gray.300" />

                <Box
                    border="2px solid"
                    borderColor="gray.300"
                    bg="#c8d4ea"
                    borderRadius="12px"
                    p={6}
                >
                    <Heading size="md" color="white" bg="#4f79bd" p={4} mb={6}>
                        Users Details
                    </Heading>

                    <UserProfile user={user} />

                    <UserInfoFields user={user} />
                </Box>
            </Box>
        </Box>
    );
}
