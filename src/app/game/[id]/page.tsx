"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./game.css";

// shape of game info returned from backend
interface GameDetails {
    id: number;
    name: string;
    cover?: { image_id: string };
    summary?: string;
}

// shape of a review object
interface Review {
    user_id: string;
    game_id: number;
    rating: number;
    review_text: string;
    username?: string;
}

export default function GamePage() {
    const router = useRouter();
    const { id } = useParams();

    // holds main data: game info, reviews from others, and your review
    const [data, setData] = useState<{
        details: GameDetails | null;
        publicReviews: Review[];
        userReview: Review | null;
    }>({ details: null, publicReviews: [], userReview: null });

    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // fetch game info + reviews from API
    useEffect(() => {
        if (!id) return; // Ensure id is available before fetching

        setLoading(true);
        setError(null); // Clear previous errors

        fetch(`/api/game/${id}`)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                    });
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setReviewText(data.userReview?.review_text || "");
            })
            .catch(err => {
                console.error("Failed to load game:", err);
                setError(err.message || "Failed to load game.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // create or update the user's review for this game
    const handleUpsertReview = async (rating: number, text: string) => { 
        if (!data.details) return;

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameId: data.details.id,
                    gameTitle: data.details.name,
                    coverUrl: data.details.cover
                        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${data.details.cover.image_id}.jpg`
                        : "",
                    rating,
                    reviewText: text
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const resData = await res.json();
            setData(prev => ({ ...prev, userReview: resData }));
        } catch (err: any) {
            console.error("Failed to save review:", err);
            setError(err.message || "Failed to save review.");
        }
    };

    // return color based on rating value
    const getRatingColor = (rating: number | null) =>
        rating
            ? rating >= 7
                ? "#3ca62b"
                : rating >= 4
                    ? "#ffbf00"
                    : "#e74c3c"
            : "#444";

    // turn a cover image ID into full-size URL
    const getHighResImage = (imageId: string) =>
        `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`;

    // show loading state
    if (loading) return <div className="game-page"><p>Loading...</p></div>;

    // handle not found or error states
    if (error || !data.details)
        return <div className="main-body"><p>{error || "Game not found."}</p></div>;

    return (
        <div className="game-page">
            <div className="game-container">
                {/* left side: cover image */}
                <div className="game-cover">
                    {data.details.cover && (
                        <img
                            src={getHighResImage(data.details.cover.image_id)}
                            alt={data.details.name}
                        />
                    )}
                </div>

                {/* right side: title + summary + rating UI */}
                <div className="game-info">
                    <h2 className="game-title">{data.details.name}</h2>
                    <p className="game-summary">{data.details.summary}</p>
                </div>

                <div className="game-actions">
                    <h3 className="rating-title">My Score</h3>
                    <div className="rating-container">
                        <div
                            className="rating-circle"
                            style={{
                                backgroundColor: getRatingColor(
                                    data.userReview?.rating ?? null
                                )
                            }}
                        >
                            {data.userReview?.rating ?? "-"}
                        </div>

                        {/* interactive rating bar (click to rate) */}
                        <div className="rating-bar">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`rating-box ${data.userReview && i < data.userReview.rating ? "filled" : ""}`}
                                    onClick={() => handleUpsertReview(i + 1, reviewText)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* review text area only shown if you've rated */}
                    {data.userReview !== null && (
                        <div className="game-review-form">
                            <h3>Leave a Review</h3>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review..."
                            />
                            <button
                                onClick={() => handleUpsertReview(data.userReview!.rating, reviewText)}
                                disabled={data.userReview?.review_text === reviewText}
                            >
                                Submit Review
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* public reviews below */}
            <div className="game-reviews-container">
                <h3>User Reviews</h3>
                {data.publicReviews.map((review) => (
                    <div key={review.user_id} className="game-review-card">
                        <div className="game-review-header">
                            <h4
                                className="game-review-username"
                                onClick={() => router.push(`/${review.username}/reviews`)}
                            >
                                {review.username}
                            </h4>
                            <span className="game-review-rating">{review.rating}/10</span>
                        </div>
                        <p className="game-review-text">{review.review_text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
