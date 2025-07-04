"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// UI components
import Pagination from "@/components/Pagination";
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import "@/profile/profile.css";

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
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    totalReviews: number;
    reviews: Review[];
}

export default function ReviewsPage() {
    const router = useRouter();
    const { username } = useParams() as { username: string };

    const [page, setPage] = useState(0);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // fetch profile + reviews whenever username or page changes
    useEffect(() => {
        if (!username) return;
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/profile/${username}?page=${page}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                }
                const data: Profile = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError((err as Error).message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username, page]);

    // follow/unfollow toggle logic
    const handleFollowToggle = async () => {
    if (!profile) return;
    
    try {
        let response;
        if (profile.isFollowing) {
            // unfollow API call
            response = await fetch(`/api/follow?username=${username}`, { method: 'DELETE' });
        } else {
            // follow API call
            response = await fetch('/api/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameToFollow: username })
            });
        }
        if (!response.ok) {
            // If user is not authorized (401), redirect to login
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            throw new Error("Failed to update follow status.");
        }

        setProfile((p: Profile | null) => {
            if (!p) return null;
            const isFollowing = !p.isFollowing;
            const followersCount = isFollowing ? p.followersCount + 1 : p.followersCount - 1;
            return { ...p, isFollowing, followersCount };
        });

    } catch (err) {
        alert((err as Error).message);
    }
};

    if (loading) return <div className="profile-container"><p>Loading...</p></div>;
    if (error) return <div className="profile-container"><p className="error">{error}</p></div>;
    if (!profile) return null;

    return (
        <div className="profile-container">
            {/* top section with image, username, and follow button */}
            <div className="profile-details">
                <Image className="profile-image" src="/default-profile.jpg" alt={`${username}'s profile`} width={150} height={150} />
                <div>
                    <div className="profile-title">
                        <h1>{username}&apos;s Reviews</h1>
                        {profile.isFollowing !== undefined && (
                            <button className="follow-btn" onClick={handleFollowToggle}>
                                {profile.isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
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
            {/* list of ReviewCards */}
            <div className="review-grid">
                {profile.reviews.map((review: Review) => (
                    <ReviewCard
                        key={review.game_id}
                        review={review}
                        onClick={(id) => router.push(`/game/${id}`)}
                    />
                ))}
            </div>
            {/* pagination controls */}
            <Pagination
                page={page}
                totalReviews={profile.totalReviews}
                onPrev={() => setPage(p => Math.max(0, p - 1))}
                onNext={() => setPage(p => p + 1)}
            />
        </div>
    );
}