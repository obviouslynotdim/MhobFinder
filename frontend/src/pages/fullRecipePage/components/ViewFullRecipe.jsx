import { Button, Center } from "@chakra-ui/react"

const ViewFullRecipe = () => {
    return (
        <Center>
            <Button 
                bg="#264473" 
                color="white" 
                colorScheme="blue" 
                width="95%" 
                minHeight="12"  
                whiteSpace="normal"  
                textAlign="center"  
                py={3}  
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                View Full Recipe
                <br />
                <span style={{ 
                    fontSize: '14px', 
                    opacity: 0.9, 
                    fontStyle: 'italic',
                    display: 'block',
                    marginTop: '2px'
                }}>
                    (Fish Amok)
                </span>
            </Button>
        </Center>
    )
}

export default ViewFullRecipe;