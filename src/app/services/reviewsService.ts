import { getUserReviews } from "@/api/reviews";

export type Review = {
    games?: { game_title: string };
    rating: number;
    review_text: string;
};

export const reviewsService = {
    async fetchForUser(userId: string): Promise<Review[]> {
        const { data } = await getUserReviews(
            userId,
            0,
            1000,
            "rating",
            false
        );
        let reviews = data as Review[];

        // If too many, pick high/mid/low samples
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
            (r) =>
                `{Game Title: ${r.games?.game_title} | User Rating: (${r.rating}/10) | Review Text: "${r.review_text}"}`
        ).join(",\n");
    },
};