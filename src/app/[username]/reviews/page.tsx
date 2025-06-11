"use client";

import React, { useEffect, useState } from "react";
import "@/profile/profile.css";
import { useParams, useRouter } from "next/navigation";
import { useProfileData } from "@/hooks/useProfileData";

import Pagination from "@/components/Pagination";
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";

import { followUser, unfollowUser, isFollowingUser } from "@/api/follow";
import { useUser } from "@/context/UserContext";

const REVIEWS_PER_PAGE = 50;

export default function ReviewsPage() {
    const router = useRouter();

    // get currently logged-in user from context
    const { user } = useUser();

    // username from URL params (e.g., /profile/:username)
    const { username } = useParams() as { username: string };

    // which review page we're on
    const [page, setPage] = useState<number>(0);

    // grab all the profile-related data (reviews, stats, etc)
    const {
        reviews,
        loading,
        error,
        totalReviews,
        followersCount,
        followingCount,
        setReviews,
        setTotalReviews
    } = useProfileData(page, username);

    // handle whether current user follows this profile
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [checkingFollowStatus, setCheckingFollowStatus] = useState<boolean>(true);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            // don't check follow status if you're looking at your own profile
            if (!user || !username || user.username === username) return;

            setCheckingFollowStatus(true);
            console.log("Checking follow status for:", user.id, "→", username);

            try {
                const { isFollowing } = await isFollowingUser(user.id, username);
                console.log("Follow status:", isFollowing);
                setIsFollowing(isFollowing);
            } catch (err) {
                console.error("Failed to check follow status:", err);
            }

            setCheckingFollowStatus(false);
        };

        // check follow status only if user is logged in and it's not their own profile
        if (user && username && user.username !== username) {
            fetchFollowStatus();
        }
    }, [user, username]);

    // handles follow/unfollow button toggle
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

    // go to next page of reviews
    const handleNextPage = () => {
        if ((page + 1) * REVIEWS_PER_PAGE < totalReviews) {
            setPage(prev => prev + 1);
        }
    };

    // go to previous page of reviews
    const handlePrevPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    };

    // click handler to go to a specific game's page
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

                        {/* Only show follow button if you're viewing someone else's profile */}
                        {user?.username !== username && !checkingFollowStatus && (
                            <button className="follow-btn" onClick={handleFollowToggle}>
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}

                        <button className="profile-option-btn">...</button>
                    </div>

                    <ProfileStats
                        followers={followersCount}
                        following={followingCount}
                        reviews={totalReviews}
                    />
                </div>
            </div>

            <hr />

            <div className="review-grid">
                {reviews.map(review => (
                    <ReviewCard
                        key={`${review.user_id}-${review.game_id}`}
                        review={review}
                        onClick={handleGameClick}
                    />
                ))}
            </div>

            <Pagination
                page={page}
                totalReviews={totalReviews}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
            />
        </div>
    );
};