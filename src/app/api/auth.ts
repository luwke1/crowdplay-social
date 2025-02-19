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
  gameTitle: string,
  coverUrl: string,
  rating: number,
  reviewText: string = ""
) => {
  try {
    // Check if the game already exists in the database
    const { data: existingGame, error: gameError } = await supabase
      .from("games")
      .select("game_id")
      .eq("game_id", gameId)
      .single();

    if (!existingGame) {
      // Insert game into `games` table if it doesn't exist
      const { error: insertGameError } = await supabase.from("games").insert([
        {
          game_id: gameId,
          game_title: gameTitle,
          cover_url: coverUrl,
        },
      ]);
      if (insertGameError) throw insertGameError;
    }

    // Upsert the review (no more game_title or cover_url in reviews table)
    const { data, error } = await supabase.from("reviews").upsert(
      [
        {
          user_id: userId,
          game_id: gameId,
          rating: rating,
          review_text: reviewText,
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id, game_id" }
    );

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error upserting review:", err);
    throw err;
  }
};

export const removeUserReview = async (user: any, gameId: number) => {
  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);

    return { error };
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
}