import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    const gameId = Number(params.id);
    if (isNaN(gameId)) return NextResponse.json({ error: "Invalid Game ID" }, { status: 400 });

    // Construct absolute URL for IGDB API call
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const igdbApiUrl = `${proto}://${host}/api/igdb?id=${gameId}`;

    try {
        const { data: { user } } = await supabase.auth.getUser();

        const [igdbRes, publicReviewsRes, userReviewRes] = await Promise.all([
            axios.get(igdbApiUrl),
            supabase.rpc("get_game_reviews", { game_id_input: gameId }),
            user ? supabase.from("reviews").select("*").eq("user_id", user.id).eq("game_id", gameId).maybeSingle() : Promise.resolve({ data: null })
        ]);

        return NextResponse.json({
            details: igdbRes.data,
            publicReviews: publicReviewsRes.data || [],
            userReview: userReviewRes.data, // Will be null if not logged in or no review
        });
    } catch (_error) {
        return NextResponse.json({ error: "Failed to fetch game page data" }, { status: 500 });
    }
}