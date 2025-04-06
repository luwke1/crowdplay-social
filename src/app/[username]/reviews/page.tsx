"use client";

import React, { useEffect, useState } from "react";
import { getReviewsUsername } from "@/api/reviews";
import "@/profile/profile.css";
import { useParams, useRouter } from "next/navigation";

const REVIEWS_PER_PAGE = 50;

export default function ReviewsPage() {
    const router = useRouter();
    
    const { username } = useParams();
    const [user, setUser] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);

    const getRatingColor = (rating: number) => {
        if (rating >= 7) return "#3ca62b";
        if (rating >= 4) return "#ffbf00";
        return "#e74c3c";
    };

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {

                const { data, count, error: reviewError } = await getReviewsUsername(username, page, REVIEWS_PER_PAGE);

                if (reviewError) {
                    setError("Error fetching reviews.");
                } else {
                    setReviews(data || []);
                    setTotalReviews(count || 0);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load reviews.");
            }
            setLoading(false);
        };

        fetchReviews();
    }, [page]);


    const handleNextPage = () => {
        if ((page + 1) * REVIEWS_PER_PAGE < totalReviews) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleGameClick = (gameId: number) => {
        router.push(`/game/${gameId}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-details">
                <img className="profile-image" src="/default-profile.jpg" alt="" />
                <div>
                    <div className="profile-title">
                        <h1>{username} Reviews</h1>
                        <button className="follow-btn">Follow</button>
                        <button className="profile-option-btn">...</button>
                    </div>
                    <div className="profile-stats">
                        <div>
                            <span>0</span>
                            <span>Followers</span>
                        </div>
                        <div>
                            <span>0</span>
                            <span>Following</span>
                        </div>
                        <div>
                            <span>{totalReviews}</span>
                            <span>Reviews</span>
                        </div>
                    </div>

                </div>
            </div>

            <hr />

            <div className="review-grid">
                {reviews.map((review) => (
                    <div key={`${review.user_id}-${review.game_id}`} onClick={() => handleGameClick(review.game_id)} className="review-card">
                        <img className="card-cover" src={review.games.cover_url} alt={review.games.game_title} />
                        <div
                            className="rating-badge"
                            style={{ backgroundColor: getRatingColor(review.rating) }}
                        >
                            {review.rating}
                        </div>
                    </div>
                ))}
            </div>


            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 0}>
                    Previous
                </button>
                <span>
                    Page {page + 1} of {Math.ceil(totalReviews / REVIEWS_PER_PAGE)}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={(page + 1) * REVIEWS_PER_PAGE >= totalReviews}
                >
                    Next
                </button>
            </div>
        </div>
    );
};