import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { queryIgdb } from "@/services/igdbService";

export async function GET(
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const gameId = Number(params.id);

    if (isNaN(gameId)) {
        return NextResponse.json({ error: "Invalid Game ID" }, { status: 400 });
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();

        const igdbQuery = `fields name, cover.image_id, rating, summary, genres.name, release_dates.date; where id = ${gameId};`;

        const [igdbData, publicReviewsRes, userReviewRes] = await Promise.all([
            queryIgdb("games", igdbQuery).then(data => data[0] || null),
            supabase.rpc("get_game_reviews", { game_id_input: gameId }),
            user 
                ? supabase.from("reviews").select("*").eq("user_id", user.id).eq("game_id", gameId).maybeSingle() 
                : Promise.resolve({ data: null, error: null })
        ]);

        if (!igdbData) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        if (publicReviewsRes.error) throw publicReviewsRes.error;
        if (userReviewRes.error) throw userReviewRes.error;

        return NextResponse.json({
            details: igdbData,
            publicReviews: publicReviewsRes.data || [],
            userReview: userReviewRes.data,
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        console.error(`Error fetching game data for ID ${gameId}:`, errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}