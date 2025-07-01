"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Image from "next/image";

// UI components
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import Pagination from "@/components/Pagination";
import "./profile.css";

// Defined interfaces for type safety
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
    reviews: Review[];
    totalReviews: number;
    followersCount: number;
    followingCount: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    // fetch logged-in user's profile
    useEffect(() => {
        setLoading(true);
        axios.get<Profile>(`/api/profile/me?page=${page}`)
            .then(res => {
                setProfile(res.data);
            })
            .catch(err => {
                if ((err as AxiosError).response?.status === 401) {
                    router.push('/login');
                } else {
                    const axiosError = err as AxiosError<{ error: string }>;
                    setError(axiosError.response?.data?.error || "Could not load your profile.");
                }
            })
            .finally(() => setLoading(false));
    }, [page, router]);

    // delete review handler
    const handleRemoveReview = async (gameId: number) => {
        if (!profile) return;
        const originalReviews = [...profile.reviews];

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
        } catch {
            alert("Failed to delete review.");
            setProfile(prevProfile => {
                 if (!prevProfile) return null;
                 return { ...prevProfile, reviews: originalReviews, totalReviews: originalReviews.length };
            });
        }
    };

    if (loading) return <div className="profile-container"><p>Loading profile...</p></div>;
    if (error) return <div className="profile-container"><p className="error" style={{ color: '#ff5555' }}>{error}</p></div>;
    if (!profile) return null;

    return (
        <div className="profile-container">
            <div className="profile-details">
                <Image className="profile-image" src="/default-profile.jpg" alt="Profile" width={150} height={150} />
                <div>
                    <div className="profile-title">
                        <h1>My Reviews</h1>
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
            <div className="review-grid">
                {profile.reviews.map((review) => (
                    <ReviewCard
                        key={review.game_id}
                        review={review}
                        onDelete={handleRemoveReview}
                        onClick={(id) => router.push(`/game/${id}`)}
                    />
                ))}
            </div>
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