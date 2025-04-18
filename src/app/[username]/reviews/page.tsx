"use client";

import React, { useEffect, useState } from "react";
import { getReviewsUsername } from "@/api/reviews";
import "@/profile/profile.css";
import { useParams, useRouter } from "next/navigation";

import { followUser, unfollowUser, isFollowingUser } from "@/api/follow";
import { useUser } from "@/context/UserContext";

const REVIEWS_PER_PAGE = 50;

export default function ReviewsPage() {
    const router = useRouter();

    const { user } = useUser();

    const { username } = useParams() as { username: string };
    
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);

    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [checkingFollowStatus, setCheckingFollowStatus] = useState<boolean>(true);


    const getRatingColor = (rating: number) => {
        if (rating >= 7) return "#3ca62b";
        if (rating >= 4) return "#ffbf00";
        return "#e74c3c";
    };


    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const { data, count, error: reviewError } = await getReviewsUsername(username, page, REVIEWS_PER_PAGE);

                if (reviewError) {
                    console.error("Error fetching reviews:");
                } else {
                    setReviews(data || []);
                    setTotalReviews(count || 0);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        console.log(user, "USER ID");



        fetchReviews();
    }, [page]);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (!user || !username || user.username === username) return;
            setCheckingFollowStatus(true);

            try {
                const { isFollowing } = await isFollowingUser(user.id, username);
                setIsFollowing(isFollowing);
            } catch (err) {
                console.error("Failed to check follow status:", err);
            }

            setCheckingFollowStatus(false);
        };

        fetchFollowStatus();
    }, [user, username]);

    const handleFollowToggle = async () => {
        if (!user) return;

        try {
            if (isFollowing) {
                await unfollowUser(user.id, username);
                setIsFollowing(false);
            } else {
                await followUser(user.id, username);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Error updating follow state:", err);
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
                        {user?.username !== username && !checkingFollowStatus && (
                            <button className="follow-btn" onClick={handleFollowToggle}>
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
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