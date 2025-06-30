import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./game.css";
import GameActions from "./GameActions";
import { queryIgdb } from "@/services/igdbService";

interface PublicReview {
    user_id: string;
    username: string;
    rating: number;
    review_text: string;
}

// Fetches main game details from IGDB using the new service
async function getGameDetails(gameId: number) {
    try {
        const query = `fields name, cover.image_id, summary; where id = ${gameId};`;
        const data = await queryIgdb("games", query);
        if (!data || data.length === 0) return null;
        return data[0];
    } catch (error) {
        console.error("Failed to fetch game details from IGDB:", error);
        return null;
    }
}

export default async function GamePage({ params }: { params: { id: string } }) {
    const gameId = Number(params.id);
    if (isNaN(gameId)) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch all data in parallel
    const [details, publicReviewsRes, userReviewRes] = await Promise.all([
        getGameDetails(gameId),
        supabase.rpc("get_game_reviews", { game_id_input: gameId }),
        user ? supabase.from("reviews").select("rating, review_text").eq("user_id", user.id).eq("game_id", gameId).maybeSingle() : Promise.resolve({ data: null })
    ]);

    if (!details) {
        notFound();
    }

    const publicReviews = (publicReviewsRes.data || []) as PublicReview[];
    const userReview = userReviewRes?.data || null;
    const highResImage = details.cover
        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${details.cover.image_id}.jpg`
        : "/default-cover.jpg";

    return (
        <div className="game-page">
            <div className="game-container">
                <div className="game-cover">
                    <Image
                        src={highResImage}
                        alt={details.name}
                        width={250}
                        height={333}
                        priority={true}
                        unoptimized={highResImage === "/default-cover.jpg"}
                        style={{ maxWidth: '250px', height: 'auto', borderRadius: '10px' }}
                    />
                </div>
                <div className="game-info">
                    <h2 className="game-title">{details.name}</h2>
                    <p className="game-summary">{details.summary || "No summary available."}</p>
                </div>
                <GameActions gameDetails={details} initialUserReview={userReview} />
            </div>
            <div className="game-reviews-container">
                <h3>User Reviews</h3>
                {publicReviews.length > 0 ? (
                    publicReviews.map((review) => (
                        <div key={review.user_id} className="game-review-card">
                            <div className="game-review-header">
                                <Link href={`/${review.username}/reviews`} className="game-review-username">
                                    <h4>{review.username}</h4>
                                </Link>
                                <span className="game-review-rating">{review.rating}/10</span>
                            </div>
                            <p className="game-review-text">{review.review_text}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first!</p>
                )}
            </div>
        </div>
    );
}