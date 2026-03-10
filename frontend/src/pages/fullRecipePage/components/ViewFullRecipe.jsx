import { Button, Center } from "@chakra-ui/react";
import colors from "../../../theme/tokens";

const ViewFullRecipe = () => {
  return (
    <Center>
      <Button
        bg={colors.dark}
        color="white"
        colorScheme="blue"
        width="100%"
        minHeight="12"
        whiteSpace="normal"
        textAlign="center"
        py={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        fontWeight="bold"
        _hover={{ bg: colors.darkest }}
      >
        View Full Recipe
      </Button>
    </Center>
  );
};

export default ViewFullRecipe;