"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// UI components
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import Pagination from "@/components/Pagination";
import "./profile.css";

export default function ProfilePage() {
    const router = useRouter();

    // main profile state object
    const [profile, setProfile] = useState<any>(null);

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
        const originalReviews = [...profile.reviews];

        // update state optimistically
        setProfile((p: any) => ({
            ...p,
            reviews: p.reviews.filter((r: any) => r.game_id !== gameId),
            totalReviews: p.totalReviews - 1,
        }));

        try {
            await axios.delete('/api/reviews', { data: { gameId } });
        } catch (err) {
            // if request fails, revert UI state
            alert("Failed to delete review.");
            setProfile((p: any) => ({
                ...p,
                reviews: originalReviews,
                totalReviews: p.totalReviews + 1
            }));
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
                {profile.reviews.map((review: any) => (
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
