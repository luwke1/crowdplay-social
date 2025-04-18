import {supabase} from "@/utils/supabase";

export const getIdByUsername = async (username: string) => {
    try {
        const {data, error} = await supabase
            .from("profiles")
            .select("id")
            .eq("username", username)
            .single();

        if (error) throw error;

        return data.id;
    } catch (err) {
        console.error("Error fetching user ID:", err);
        throw err;
    }
}

export const getAccountDetails = async (userId: string) => {
    try {
        const { count: followingCount, error: followersError } = await supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId);
        
        const {count: followersCount, error: followingError} = await supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("followed_id", userId);

        if (followersError || followingError) {
            console.error("Error fetching account details:", followersError || followingError);
            return null;
        }

        return {
            followers: followersCount,
            following: followingCount,
        };
    } catch (err) {
        console.error("Unexpected error fetching account details:", err);
        return null;
    }
}