"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getRatingColor } from "@/utils/ratingColor";

// Define the shape of the props this component will receive
interface GameDetails {
    id: number;
    name: string;
    cover?: { image_id: string };
}

interface UserReview {
    rating: number;
    review_text: string;
}

interface GameActionsProps {
    gameDetails: GameDetails;
    initialUserReview: UserReview | null;
}

export default function GameActions({ gameDetails, initialUserReview }: GameActionsProps) {
    const router = useRouter();
    const [userReview, setUserReview] = useState(initialUserReview);
    const [reviewText, setReviewText] = useState(initialUserReview?.review_text || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpsertReview = async (rating: number, text: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: gameDetails.id,
                    gameTitle: gameDetails.name,
                    coverUrl: gameDetails.cover
                        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails.cover.image_id}.jpg`
                        : "",
                    rating,
                    reviewText: text
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401) {
                    router.push('/login');
                } else {
                    throw new Error(errorData.error || "Failed to save review.");
                }
                return;
            }

            const updatedReview = await res.json();
            setUserReview(updatedReview);
            // Re-fetch server components to reflect new public review
            router.refresh(); 

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentRating = userReview?.rating ?? 0;
    const originalText = userReview?.review_text || "";
    const isButtonDisabled = currentRating === 0 || reviewText === originalText || isSubmitting;


    return (
        <div className="game-actions">
            <h3 className="rating-title">My Score</h3>
            <div className="rating-container">
                <div
                    className="rating-circle"
                    style={{ backgroundColor: getRatingColor(currentRating) }}
                >
                    {currentRating || "-"}
                </div>
                <div className="rating-bar">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`rating-box ${currentRating > i ? "filled" : ""}`}
                            onClick={() => handleUpsertReview(i + 1, reviewText)}
                        />
                    ))}
                </div>
            </div>

            {/* Show review form only if the user has given a rating */}
            {currentRating > 0 && (
                <div className="game-review-form">
                    <h3>Leave a Review</h3>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <button
                        onClick={() => handleUpsertReview(currentRating, reviewText)}
                        disabled={isButtonDisabled}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            )}
        </div>
    );
}