import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { getAllFoods } from "../../services/api/food.service";
import { getCommentsByFood } from "../../services/api/comment.service";
import { getRatingsByFood } from "../../services/api/rating.service";

function getLast7DayLabels() {
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString(undefined, { weekday: "short" }));
    }
    return labels;
}

function normalizeCreatedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export default function Analytical() {
    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]);
    const [commentsByFood, setCommentsByFood] = useState([]);
    const [ratingsByFood, setRatingsByFood] = useState([]);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            setLoading(true);
            try {
                const foodData = await getAllFoods();
                const safeFoods = Array.isArray(foodData) ? foodData : [];

                const [commentResults, ratingResults] = await Promise.all([
                    Promise.all(
                        safeFoods.map((food) =>
                            getCommentsByFood(food.food_id)
                                .then((comments) => ({ foodId: food.food_id, comments: Array.isArray(comments) ? comments : [] }))
                                .catch(() => ({ foodId: food.food_id, comments: [] })),
                        ),
                    ),
                    Promise.all(
                        safeFoods.map((food) =>
                            getRatingsByFood(food.food_id)
                                .then((ratings) => ({ foodId: food.food_id, ratings: Array.isArray(ratings) ? ratings : [] }))
                                .catch(() => ({ foodId: food.food_id, ratings: [] })),
                        ),
                    ),
                ]);

                if (!mounted) return;
                setFoods(safeFoods);
                setCommentsByFood(commentResults);
                setRatingsByFood(ratingResults);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadData();
        return () => {
            mounted = false;
        };
    }, []);

    const analytics = useMemo(() => {
        const commentsFlat = commentsByFood.flatMap((entry) => entry.comments);
        const ratingsFlat = ratingsByFood.flatMap((entry) => entry.ratings);

        const totalFoods = foods.length;
        const totalComments = commentsFlat.length;
        const avgRating = ratingsFlat.length
            ? (
                    ratingsFlat.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
                    ratingsFlat.length
                ).toFixed(1)
            : "0.0";

        const commentsByFoodMap = new Map();
        commentsByFood.forEach((entry) => {
            commentsByFoodMap.set(entry.foodId, entry.comments.length);
        });

        const topFoods = foods
            .map((food) => ({
                title: food.title || `Food #${food.food_id}`,
                count: commentsByFoodMap.get(food.food_id) || 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const ingredientCounts = new Map();
        foods.forEach((food) => {
            const ingredients = Array.isArray(food.ingredients) ? food.ingredients : [];
            ingredients.forEach((ingredient) => {
                const key = ingredient.name || "Unknown";
                ingredientCounts.set(key, (ingredientCounts.get(key) || 0) + 1);
            });
        });

        const topIngredients = Array.from(ingredientCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        const labels = getLast7DayLabels();
        const today = new Date();
        const dayKeys = [];
        for (let i = 6; i >= 0; i -= 1) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dayKeys.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime());
        }

        const commentTrend = dayKeys.map((key) =>
            commentsFlat.filter((comment) => normalizeCreatedDate(comment.createdAt) === key).length,
        );

        return {
            totalFoods,
            totalComments,
            avgRating,
            topFoods,
            topIngredients,
            commentTrend,
            labels,
        };
    }, [foods, commentsByFood, ratingsByFood]);

    const maxTrend = Math.max(...analytics.commentTrend, 1);
    const trendPolyline = analytics.commentTrend
        .map((value, index) => {
            const x = (index / 6) * 100;
            const y = 100 - (value / maxTrend) * 90;
            return `${x},${y}`;
        })
        .join(" ");

    const topFoodMax = Math.max(...analytics.topFoods.map((item) => item.count), 1);
    const topIngredientMax = Math.max(
        ...analytics.topIngredients.map((item) => item.count),
        1,
    );

    if (loading) {
        return (
            <Flex h="calc(100vh - 90px - 48px)" justify="center" align="center" direction="column" gap={3}>
                <Spinner size="lg" color="#4f79bd" />
                <Text color="gray.600">Analyzing dashboard data...</Text>
            </Flex>
        );
    }

    return (
        <Box h="calc(100vh - 90px - 48px)" overflow="auto" pr={1}>
            <Box
                w="100%"
                maxW="1180px"
                mx="auto"
                bg="whiteAlpha.900"
                border="1px solid"
                borderColor="#dbe5f4"
                boxShadow="0 10px 30px rgba(79,121,189,0.08)"
                borderRadius={{ base: "16px", md: "24px" }}
                p={{ base: 4, md: 6 }}
                minH="100%"
            >
                <Heading size={{ base: "md", md: "lg" }} color="#1f3d66" mb={1}>
                    Analytics Dashboard
                </Heading>
                <Text color="gray.600" mb={6}>
                    Live insight from foods, comments, and ratings.
                </Text>

                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
                    <Box bg="#fbfdff" borderRadius="14px" p={4} border="1px solid" borderColor="#dbe5f4">
                        <Text color="gray.500" fontSize="sm">Foods</Text>
                        <Text fontWeight="800" color="#2b4c7e" fontSize="3xl">{analytics.totalFoods}</Text>
                    </Box>

                    <Box bg="#fbfdff" borderRadius="14px" p={4} border="1px solid" borderColor="#dbe5f4">
                        <Text color="gray.500" fontSize="sm">Comments</Text>
                        <Text fontWeight="800" color="#2b4c7e" fontSize="3xl">{analytics.totalComments}</Text>
                    </Box>

                    <Box bg="#fbfdff" borderRadius="14px" p={4} border="1px solid" borderColor="#dbe5f4">
                        <Text color="gray.500" fontSize="sm">Average Rating</Text>
                        <Text fontWeight="800" color="#2b4c7e" fontSize="3xl">{analytics.avgRating}</Text>
                    </Box>
                </Grid>

                <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }} gap={4}>
                    <Box bg="#fbfdff" borderRadius="14px" p={5} border="1px solid" borderColor="#dbe5f4">
                        <Heading size="sm" mb={1} color="#2b4c7e">Comment Trend (Last 7 Days)</Heading>
                        <Text color="gray.500" fontSize="sm" mb={4}>Daily comment activity</Text>

                        <Box h="220px" position="relative">
                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                style={{ width: "100%", height: "100%" }}
                            >
                                <polyline
                                    fill="rgba(79,121,189,0.12)"
                                    stroke="none"
                                    points={`${trendPolyline} 100,100 0,100`}
                                />
                                <polyline
                                    fill="none"
                                    stroke="#4f79bd"
                                    strokeWidth="2.5"
                                    points={trendPolyline}
                                />
                            </svg>
                        </Box>

                        <Flex justify="space-between" mt={2}>
                            {analytics.labels.map((label) => (
                                <Text key={label} fontSize="xs" color="gray.600">{label}</Text>
                            ))}
                        </Flex>
                    </Box>

                    <Box bg="#fbfdff" borderRadius="14px" p={5} border="1px solid" borderColor="#dbe5f4">
                        <Heading size="sm" mb={1} color="#2b4c7e">Top Foods by Comments</Heading>
                        <Text color="gray.500" fontSize="sm" mb={4}>Most discussed recipes</Text>

                        {analytics.topFoods.length === 0 ? (
                            <Text color="gray.500">No data yet.</Text>
                        ) : (
                            <Stack gap={4}>
                                {analytics.topFoods.map((item) => {
                                    const width = `${Math.max((item.count / topFoodMax) * 100, 8)}%`;
                                    return (
                                        <Box key={item.title}>
                                            <Flex justify="space-between" mb={1} gap={3}>
                                                <Text fontSize="sm" color="gray.700" noOfLines={1}>{item.title}</Text>
                                                <Text fontSize="sm" color="gray.500">{item.count}</Text>
                                            </Flex>
                                            <Box bg="#edf2fb" h="8px" borderRadius="full" overflow="hidden">
                                                <Box h="100%" bg="#4f79bd" borderRadius="full" w={width} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>

                    <Box
                        gridColumn={{ base: "auto", lg: "1 / span 2" }}
                        bg="#fbfdff"
                        borderRadius="14px"
                        p={5}
                        border="1px solid"
                        borderColor="#dbe5f4"
                    >
                        <Heading size="sm" mb={1} color="#2b4c7e">Ingredient Popularity</Heading>
                        <Text color="gray.500" fontSize="sm" mb={4}>Ingredients appearing across recipes</Text>

                        {analytics.topIngredients.length === 0 ? (
                            <Text color="gray.500">No ingredient data available.</Text>
                        ) : (
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                {analytics.topIngredients.map((item) => {
                                    const width = `${Math.max((item.count / topIngredientMax) * 100, 8)}%`;
                                    return (
                                        <Box key={item.name}>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm" fontWeight="600" color="gray.700">{item.name}</Text>
                                                <Text fontSize="sm" color="gray.500">{item.count}</Text>
                                            </Flex>
                                            <Box bg="#eef4ff" h="10px" borderRadius="full" overflow="hidden">
                                                <Box h="100%" bg="#6ea0df" borderRadius="full" w={width} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
}
