import { Avatar, Button, Card, Center } from "@chakra-ui/react"
import MayLikeCard from "./MayLikeCard";


const MayLike = () => {
  return (
    <Center>
      <Card.Root width="100%">
        <Card.Body gap="2">
          <Card.Title mt="2">You Might Also Like</Card.Title>
        </Card.Body>
        <Card.Description>
          <MayLikeCard/>
          <MayLikeCard/>
        </Card.Description>
        <Card.Footer justifyContent="center">
          <Button bg="#4975BB" width="40%">Show More</Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  )
}

export default MayLike;