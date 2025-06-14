import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST (Create/Update a review)
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gameId, gameTitle, coverUrl, rating, reviewText } = await request.json();
    if (!gameId || rating === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Step 1: Upsert the game details into 'games' table.
        const { error: gameError } = await supabase
            .from("games")
            .upsert(
                { game_id: gameId, game_title: gameTitle, cover_url: coverUrl },
                { onConflict: 'game_id' }
            );

        if (gameError) throw gameError;
        
        // Step 2: Now that the game is guaranteed to exist, upsert the review.
        const { data, error: reviewError } = await supabase
            .from("reviews")
            .upsert({ user_id: user.id, game_id: gameId, rating, review_text: reviewText })
            .select()
            .single();

        if (reviewError) throw reviewError;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error in review POST route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a review
export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gameId } = await request.json();
    if (!gameId) return NextResponse.json({ error: "Game ID is required" }, { status: 400 });

    const { error } = await supabase.from("reviews").delete().match({ user_id: user.id, game_id: gameId });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Review deleted" }, { status: 200 });
}