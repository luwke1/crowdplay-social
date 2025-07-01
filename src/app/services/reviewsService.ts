import { createClient } from "@/utils/supabase/server";

export type Review = {
    games?: { game_title: string } | null;
    rating: number;
    review_text: string | null;
};

// This function directly fetches reviews from Supabase.
async function fetchUserReviewsFromDB(userId: string): Promise<{ data: Review[] | null, error: Error | null }> {
    const supabase = await createClient();

    // Fetch up to 1000 reviews, ordered by rating descending
    const { data, error } = await supabase.from("reviews").select(`rating, review_text, games(game_title)`).eq("user_id", userId).order("rating", { ascending: false }).limit(1000);
    if (error) {
        return { data: null, error: new Error(error.message) };
    }
    
    // Safely map the returned data to the Review type
    const typedData: Review[] = (data || []).map(item => ({
        rating: item.rating,
        review_text: item.review_text,
        games: Array.isArray(item.games) ? item.games[0] : item.games,
    }));

    return { data: typedData, error: null };
}

export const reviewsService = {
    async fetchForUser(userId: string): Promise<Review[]> {
        const { data, error } = await fetchUserReviewsFromDB(userId);
        if (error || !data) {
            console.error("Failed to fetch user reviews for recommendations:", error);
            return [];
        }

        let reviews = data;

        // If user has many reviews, take a sample for a balanced view
        if (reviews.length > 45) {
            const high = reviews.slice(0, 15);
            const low = reviews.slice(-15);
            const midStart = Math.floor((reviews.length - 15) / 2);
            const mid = reviews.slice(midStart, midStart + 15);
            reviews = [...high, ...mid, ...low];
        }
        return reviews;
    },

    formatReviews(reviews: Review[]): string {
        return reviews.map(
            (r) => `{Game Title: ${r.games?.game_title} | User Rating: (${r.rating}/10) | Review Text: "${r.review_text ?? ''}"}`
        ).join(",\n");
    },
};