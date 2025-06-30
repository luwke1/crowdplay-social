"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// UI components
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import Pagination from "@/components/Pagination";
import "./profile.css";

interface Review {
    game_id: number;
    user_id: string;
    rating: number;
    review_text: string | null;
    created_at: string;
    games: {
        game_title: string;
        cover_url: string | null;
    } | null;
}

interface Profile {
    id: string;
    reviews: Review[];
    totalReviews: number;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
}

export default function ProfilePage() {
    const router = useRouter();

    // main profile state object
    const [profile, setProfile] = useState<Profile | null>(null);

    // loading and error state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // pagination tracking
    const [page, setPage] = useState(0);

    // fetch logged-in user's profile
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/profile/me?page=${page}`)
            .then(res => {
                setProfile(res.data);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    // redirect to login if not authenticated
                    router.push('/login');
                } else {
                    setError(err.response?.data?.error || "Could not load your profile.");
                }
            })
            .finally(() => setLoading(false));
    }, [page, router]);

    // delete review handler
    const handleRemoveReview = async (gameId: number) => {
        if (!profile) return;

        const originalReviews = [...profile.reviews];

        // update state optimistically
        setProfile(prevProfile => {
            if (!prevProfile) return null;
            return {
                ...prevProfile,
                reviews: prevProfile.reviews.filter((r) => r.game_id !== gameId),
                totalReviews: prevProfile.totalReviews - 1,
            };
        });

        try {
            await axios.delete('/api/reviews', { data: { gameId } });
        } catch (err) {
            // if request fails, revert UI state
            alert("Failed to delete review.");
            setProfile(prevProfile => {
                if (!prevProfile) return null;
                return {
                    ...prevProfile,
                    reviews: originalReviews,
                    totalReviews: prevProfile.totalReviews + 1,
                }
            });
        }
    };

    // handle loading and error fallback views
    if (loading) return <div className="profile-container"><p>Loading profile...</p></div>;
    if (error) return <div className="profile-container"><p className="error" style={{ color: '#ff5555' }}>{error}</p></div>;
    if (!profile) return null;

    return (
        <div className="profile-container">
            {/* profile header section */}
            <div className="profile-details">
                <img className="profile-image" src="/default-profile.jpg" alt="Profile" />
                <div>
                    <div className="profile-title">
                        <h1>My Reviews</h1>
                        {/* placeholder for future settings/actions */}
                        <button className="profile-option-btn">...</button>
                    </div>
                    <ProfileStats
                        followers={profile.followersCount}
                        following={profile.followingCount}
                        reviews={profile.totalReviews}
                    />
                </div>
            </div>

            <hr />

            {/* display all user reviews */}
            <div className="review-grid">
                {profile.reviews.map((review: Review) => (
                    <ReviewCard
                        key={review.game_id}
                        review={review}
                        onDelete={handleRemoveReview}
                        onClick={(id) => router.push(`/game/${id}`)}
                    />
                ))}
            </div>

            {/* only show pagination if user has more than one page of reviews */}
            {profile.totalReviews > 50 && (
                <Pagination
                    page={page}
                    totalReviews={profile.totalReviews}
                    onPrev={() => setPage(p => p - 1)}
                    onNext={() => setPage(p => p + 1)}
                />
            )}
        </div>
    );
}
