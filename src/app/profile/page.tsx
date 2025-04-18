"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/api/auth";
import { getAccountDetails } from "@/api/users";
import { removeUserReview, getUserReviews } from "@/api/reviews";
import "./profile.css";

const REVIEWS_PER_PAGE = 50;

const getRatingColor = (rating: number) => {
    if (rating >= 7) return "#3ca62b";
    if (rating >= 4) return "#ffbf00";
    return "#e74c3c";
};

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);

    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    setError("No user logged in.");
                    setLoading(false);
                    return;
                }
                setUser(currentUser);

                fetchAccountDetails(currentUser.id);

                const { data, count, error: reviewError } = await getUserReviews(currentUser.id, page, REVIEWS_PER_PAGE);

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

    const fetchAccountDetails = async (currentUserID:string) => {
            try {
    
                const counts = await getAccountDetails(currentUserID);
                if (counts) {
                    setFollowersCount(counts.followers ?? 0);
                    setFollowingCount(counts.following ?? 0);
                }
            } catch (err) {
                console.error("Failed to fetch counts:", err);
            }
        };

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

    const removeReview = async (gameId: number) => {
        if (!user) return;

        try {
            // Call API to remove review
            const { error } = await removeUserReview(user, gameId);
            if (error) throw error;

            // Update UI by filtering out deleted review
            setReviews((prevReviews) => prevReviews.filter(review => review.game_id !== gameId));
            setTotalReviews((prevCount) => Math.max(prevCount - 1, 0));

            console.log("Review removed successfully!");
        } catch (err) {
            console.error("Failed to delete review:", err);
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
                        <h1>My Reviews</h1>
                        <button className="profile-option-btn">...</button>
                    </div>
                    <div className="profile-stats">
                        <div>
                            <span>{followersCount}</span>
                            <span>Followers</span>
                        </div>
                        <div>
                            <span>{followingCount}</span>
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

            {loading && <p>Loading reviews...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && reviews.length === 0 && <p>No reviews found.</p>}

            <div className="review-grid">
                {reviews.map((review) => (
                    <div key={`${review.user_id}-${review.game_id}`} className="review-card">
                        <img onClick={() => removeReview(review.game_id)} className="delete-icon" src="/deleteIcon.svg" alt="Delete Icon" width={24} height={24} />
                        <img onClick={() => { handleGameClick(review.game_id) }} className="card-cover" src={review.games.cover_url} alt={review.games.game_title} />
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

export default ProfilePage;