import {
    Avatar,
    Box,
    Flex,
    HStack,
    Text,
    Input,
    Icon
} from "@chakra-ui/react"
import { FaStar, FaThumbsUp } from "react-icons/fa"

const CommentSection = () => {
    return (
        <Box w="100%" bg="#A7BBDD" p={6}>

            {/* Header */}
            <Flex align="center" gap={4} mb={4}>
                <Text fontSize="3xl" fontWeight="bold">Reviews</Text>

                <Box
                    bg="#2c4a7a"
                    px={4}
                    py={1}
                    borderRadius="lg"
                    color="white"
                    fontWeight="bold"
                >
                    01
                </Box>
            </Flex>

            {/* Add comment */}
            <Flex align="center" gap={3} mb={6}>
                <Avatar.Root shape="full" size="lg">
                    <Avatar.Image src="https://picsum.photos/200" />
                </Avatar.Root>

                <Input
                    placeholder="Add a comment..."
                    variant="flushed"
                    _focus={{ boxShadow: "none" }}
                />
            </Flex>

            {/* Review item */}
            <Flex align="start" gap={4}>
                <Avatar.Root shape="full" size="lg">
                    <Avatar.Image src="https://picsum.photos/201" />
                </Avatar.Root>

                <Box flex="1">
                    <Flex justify="space-between">
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">Naosuke</Text>

                            <Text color="gray.600" fontSize="sm">
                                Phnom Penh, Cambodia
                            </Text>

                            <HStack mt={1}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} as={FaStar} color="yellow.400" />
                                ))}
                                <Text fontSize="sm" color="gray.500">
                                    2 days ago
                                </Text>
                            </HStack>
                        </Box>

                        <Flex align="center" gap={2} color="gray.500">
                            <Icon as={FaThumbsUp} boxSize={5} />
                            <Text>100</Text>
                        </Flex>
                    </Flex>

                    <Text mt={3} color="gray.700">
                        This is absolutely amazing i love it Amok is good and easy to make,
                        im eating it right now!
                    </Text>
                </Box>
            </Flex>

        </Box>
    )
}

export default CommentSection
