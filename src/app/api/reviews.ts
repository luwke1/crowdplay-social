import { supabase } from "../utils/supabase";

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


export const getUserReviews = async (
    userId: string,
    page: number,
    limit: number,
    sortBy: string = "created_at",
    sortOrder: boolean = false
  ): Promise<{ data: any[]; count: number; error: Error | null }> => {
    const from = page * limit;
    const to = (page + 1) * limit - 1;
  
    const { data, count, error } = await supabase
      .from("reviews")
      .select(
        `game_id,
         rating,
         review_text,
         created_at,
         games(game_title, cover_url)`,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order(sortBy, { ascending: sortOrder })
      .range(from, to);
  
    if (error) {
      console.error("Error fetching user reviews:", error.message);
      return { data: [], count: 0, error };
    }
  
    return { data: data || [], count: count || 0, error: null };
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
            // Insert game into games table if it doesn't exist
            const { error: insertGameError } = await supabase.from("games").insert([
                {
                    game_id: gameId,
                    game_title: gameTitle,
                    cover_url: coverUrl,
                },
            ]);
            if (insertGameError) throw insertGameError;
        }

        // Upsert the review
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

export const getGameReviews = async (gameId: number) => {
    const { data, error } = await supabase.rpc("get_game_reviews", { game_id_input: gameId });

    if (error) {
        console.error("Error fetching reviews:", error.message);
        return [];
    }
    return data;
}

export const getReviewsUsername = async (
    username: string,
    page: number,
    limit: number
  ): Promise<{ data: any[]; error: Error | null }> => {
    // find the user
    const { data: userRow, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();
  
    if (userError || !userRow) {
      console.error("Error fetching user ID:", userError?.message || "User not found.");
      return { data: [], error: userError || new Error("User not found") };
    }
  
    // fetch their reviews page
    return getUserReviews(userRow.id, page, limit);
  };