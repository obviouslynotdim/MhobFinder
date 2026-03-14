import { Box, Grid, Heading } from "@chakra-ui/react";

import VisitorsCard from "../../components/admin/analytical/VisitorsCard";
import TopRecipesCard from "../../components/admin/analytical/TopRecipesCard";
import PopularIngredientCard from "../../components/admin/analytical/PopularIngredientCard";
import VisitDurationCard from "../../components/admin/analytical/VisitDurationCard";

export default function Analytical() {
    return (
        <Box
            h="calc(100vh - 90px - 48px)"
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                w="100%"
                maxW="980px"
                h="100%"
                bg="#cfdaf0"
                borderRadius="24px"
                p={6}
            >
                <Heading size="lg" mb={4}>
                    Analytical Page
                </Heading>

                <Box bg="#d7e7f7" borderRadius="6px" p={4} h="calc(100% - 48px)">
                    <Grid templateColumns="1fr 1fr" templateRows="1fr 1fr" gap={4} h="100%">
                        <VisitorsCard />
                        <TopRecipesCard />
                        <PopularIngredientCard />
                        <VisitDurationCard />
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
