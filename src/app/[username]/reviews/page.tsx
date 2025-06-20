"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// UI components
import Pagination from "@/components/Pagination";
import ProfileStats from "@/components/ProfileStats";
import ReviewCard from "@/components/ReviewCard";
import "@/profile/profile.css";

export default function ReviewsPage() {
    const router = useRouter();
    const { username } = useParams() as { username: string };

    // pagination state
    const [page, setPage] = useState(0);

    // holds profile data from backend
    const [profile, setProfile] = useState<any>(null);

    // basic loading and error tracking
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // fetch profile + reviews whenever username or page changes
    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                const res = await fetch(`/api/profile/${username}?page=${page}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                console.error("Failed to fetch profile:", err);
                setError(err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, page]);

    // follow/unfollow toggle logic
    const handleFollowToggle = async () => {
        try {
            if (profile.isFollowing) {
                // unfollow API call
                await fetch(`/api/follow?username=${username}`,{method:'DELETE'});
                setProfile((p: any) => ({ ...p, isFollowing: false, followersCount: p.followersCount - 1 }));
            } else {
                // follow API call
                await fetch('/api/follow', { 
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ usernameToFollow: username })
                });
                setProfile((p: any) => ({ ...p, isFollowing: true, followersCount: p.followersCount + 1 }));
            }
        } catch (err: any) {
            // if not logged in, kick to login page
            if (err.response?.status === 401) router.push('/login');
            else alert("Could not update follow status.");
        }
    };

    // basic loading/error fallback views
    if (loading) return <div className="profile-container"><p>Loading...</p></div>;
    if (error) return <div className="profile-container"><p className="error">{error}</p></div>;
    if (!profile) return null;

    return (
        <div className="profile-container">
            {/* top section with image, username, and follow button */}
            <div className="profile-details">
                <img className="profile-image" src="/default-profile.jpg" alt={`${username}'s profile`} />
                <div>
                    <div className="profile-title">
                        <h1>{username}'s Reviews</h1>
                        {profile.isFollowing !== undefined && (
                            <button className="follow-btn" onClick={handleFollowToggle}>
                                {profile.isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                        {/* might use this button later for dropdown/settings */}
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
                {profile.reviews.map((review: any) => (
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
                onPrev={() => setPage(p => p - 1)} 
                onNext={() => setPage(p => p + 1)} 
            />
        </div>
    );
}
