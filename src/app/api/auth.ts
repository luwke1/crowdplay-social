import { supabase } from "../utils/supabase";

// Sign up function
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Create user profile in the `profiles` table
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: data.user?.id, username }]);

  if (profileError) throw profileError;

  return data.user;
};

// Login function
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

// Logout function
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};


// Get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Get user reviews
export const getUserReview = async (userId: string, gameId: number) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", gameId);

  if (error) {
    console.error("Error fetching reviews:", error.message);
    return [];
  }
  return data;
};

export const upsertUserReview = async (
  userId: string,
  gameId: number,
  rating: number,
  reviewText: string = ""
) => {
  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      [
        {
          user_id: userId,
          game_id: gameId,
          rating: rating,
          review_text: reviewText,
          created_at: new Date().toISOString(),
        }
      ],
      { onConflict: "user_id, game_id" }
    );

  if (error) {
    console.error("Error updating/inserting review:", error.message);
    throw error;
  }

  return data;
};