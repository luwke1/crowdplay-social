import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import "./game.css";

// Import the new client component
import GameActions from "./GameActions";

interface PublicReview {
    user_id: string;
    username: string;
    rating: number;
    review_text: string;
}

// IGDB token logic
let igdbAccessToken = "";
async function getIgdbToken() {
    if (igdbAccessToken) return igdbAccessToken;
    const response = await axios.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
            client_id: process.env.IGDB_CLIENT_ID,
            client_secret: process.env.IGDB_CLIENT_SECRET,
            grant_type: "client_credentials",
        },
    });
    igdbAccessToken = response.data.access_token;
    return igdbAccessToken;
}

// Fetches main game details from IGDB
async function getGameDetails(gameId: number) {
    try {
        const token = await getIgdbToken();
        const query = `fields name, cover.image_id, summary; where id = ${gameId};`;
        const response = await axios.post("https://api.igdb.com/v4/games", query, {
            headers: {
                "Client-ID": process.env.IGDB_CLIENT_ID!,
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.data || response.data.length === 0) return null;
        return response.data[0];
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

    // Fetch all data in parallel for maximum speed
    const [details, publicReviewsRes, userReviewRes] = await Promise.all([
        getGameDetails(gameId),
        supabase.rpc("get_game_reviews", { game_id_input: gameId }),
        user ? supabase.from("reviews").select("rating, review_text").eq("user_id", user.id).eq("game_id", gameId).maybeSingle() : Promise.resolve({ data: null })
    ]);

    if (!details) {
        notFound();
    }

    const publicReviews = publicReviewsRes.data || [];
    const userReview = userReviewRes?.data || null;
    const highResImage = details.cover
        ? `https://images.igdb.com/igdb/image/upload/t_1080p/${details.cover.image_id}.jpg`
        : "/default-cover.jpg";

    return (
        <div className="game-page">
            <div className="game-container">
                {/* Left side: Cover Image (Server Component) */}
                <div className="game-cover">
                    <Image
                        src={highResImage}
                        alt={details.name}
                        width={250}
                        height={333} // Approximate aspect ratio for a cover
                        priority={true} // Prioritize loading the main image
                        unoptimized={highResImage === "/default-cover.jpg"} // Don't optimize the local fallback
                        style={{ maxWidth: '250px', height: 'auto', borderRadius: '10px' }}
                    />
                </div>

                {/* Middle: Game Info (Server Component) */}
                <div className="game-info">
                    <h2 className="game-title">{details.name}</h2>
                    <p className="game-summary">{details.summary || "No summary available."}</p>
                </div>

                {/* Right side: Interactive review actions (Client Component) */}
                <GameActions gameDetails={details} initialUserReview={userReview} />
            </div>

            {/* Public Reviews Section (Server Component) */}
            <div className="game-reviews-container">
                <h3>User Reviews</h3>
                {publicReviews.length > 0 ? (
                    publicReviews.map((review: PublicReview) => (
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