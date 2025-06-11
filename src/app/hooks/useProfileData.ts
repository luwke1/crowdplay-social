import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/auth";
import { getAccountDetails, getIdByUsername } from "@/api/users";
import { getUserReviews } from "@/api/reviews";

// how many reviews to pull per page (used for pagination)
const REVIEWS_PER_PAGE = 50;

// hook for loading user profile data (either logged-in user or someone else's via username)
export const useProfileData = (page: number, username?: string) => {
    // main user info (null until loaded)
    const [user, setUser] = useState<any>(null);

    // list of reviews for the current profile
    const [reviews, setReviews] = useState<any[]>([]);

    // loading + error flags for UI feedback
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // metadata counts for this user's profile
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let currentUserID: string;

                if (username) {
                    // if viewing someone else's profile, get their ID from the username
                    currentUserID = await getIdByUsername(username);
                } else {
                    // otherwise, grab the currently logged-in user
                    const currentUser = await getCurrentUser();
                    if (!currentUser) {
                        setError("No user logged in.");
                        setLoading(false);
                        return;
                    }
                    currentUserID = currentUser.id;
                    setUser(currentUser); // only set user if it's your own profile
                }

                // grab basic stats like follower count, total reviews, etc.
                const counts = await getAccountDetails(currentUserID);
                setFollowersCount(counts?.followers ?? 0);
                setFollowingCount(counts?.following ?? 0);
                setTotalReviews(counts?.reviewCount ?? 0);

                // pull paginated reviews for this user
                const { data, error: reviewError } = await getUserReviews(currentUserID, page, REVIEWS_PER_PAGE);
                if (reviewError) setError("Error fetching reviews.");
                else setReviews(data || []);
            } catch (err) {
                setError("Failed to load reviews.");
                console.error(err);
            }

            setLoading(false);
        };

        fetchData();
    }, [page, username]); // re-fetch if page changes or viewing a different user

    return {
        user,
        reviews,
        loading,
        error,
        totalReviews,
        followersCount,
        followingCount,
        setReviews,
        setTotalReviews,
    };
};