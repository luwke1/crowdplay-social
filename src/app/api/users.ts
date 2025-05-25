import { supabase } from "@/utils/supabase";

export const getIdByUsername = async (username: string) => {
  try {
    const { data, error } = await supabase
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
};

export const getAccountDetails = async (userId: string) => {
  // Count the number of reviews for the user
  const { count: reviewCount, error: reviewError } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Count followers / following
  const { count: followingCount, error: followErr1 } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  const { count: followersCount, error: followErr2 } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", userId);

  if (reviewError || followErr1 || followErr2) {
    console.error("Error fetching account details:", reviewError ?? followErr1 ?? followErr2);
    return null;
  }

  return {
    reviewCount: reviewCount ?? 0,
    followers: followersCount ?? 0,
    following: followingCount ?? 0,
  };
};
