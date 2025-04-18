import {supabase} from '@/utils/supabase';
import {getIdByUsername} from '@/api/users';

export const followUser = async (followerId: string, followedUsername: string) => {
    const followedId = await getIdByUsername(followedUsername);

    const {data, error} = await supabase
        .from('followers')
        .insert([{follower_id: followerId, followed_id: followedId}]);

    if (error) {
        console.error('Error following user:', error.message);
        return null;
    }
    return data;
}

export const unfollowUser = async (followerId: string, followedUsername: string) => {
    const followedId = await getIdByUsername(followedUsername);

    const {data, error} = await supabase
        .from('followers')
        .delete()
        .match({follower_id: followerId, followed_id: followedId});

    if (error) {
        console.error('Error unfollowing user:', error.message);
        return null;
    }
    return data;
}

export async function isFollowingUser(followerId: string, followingUsername: string) {
    const followedId = await getIdByUsername(followingUsername);

    const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", followerId)
        .eq("followed_id", followedId)
        .single();

    return { isFollowing: !!data, error };
}