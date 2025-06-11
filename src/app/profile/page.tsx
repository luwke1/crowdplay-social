"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { removeUserReview } from "@/api/reviews";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import Pagination from "@/components/Pagination";
import "./profile.css";

const REVIEWS_PER_PAGE = 50;

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const [page, setPage] = React.useState<number>(0);

    const {
        user,
        reviews,
        loading,
        error,
        totalReviews,
        followersCount,
        followingCount,
        setReviews,
        setTotalReviews
    } = useProfileData(page);

    const handleNextPage = () => {
        if ((page + 1) * REVIEWS_PER_PAGE < totalReviews) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    };

    const removeReview = async (gameId: number) => {
        if (!user) return;

        try {
            const { error } = await removeUserReview(user, gameId);
            if (error) throw error;

            setReviews(prev => prev.filter(review => review.game_id !== gameId));
            setTotalReviews(prev => Math.max(prev - 1, 0));
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
                <img className="profile-image" src="/default-profile.jpg" alt="Profile" />
                <div>
                    <div className="profile-title">
                        <h1>My Reviews</h1>
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

            {loading && <p>Loading reviews...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && reviews.length === 0 && <p>No reviews found.</p>}

            <div className="review-grid">
                {reviews.map(review => (
                    <ReviewCard
                        key={`${review.user_id}-${review.game_id}`}
                        review={review}
                        onDelete={removeReview}
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

export default ProfilePage;