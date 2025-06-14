import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("API request from user:", { id: user.id, email: user.email });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = 50;
    const from = page * limit;
    const to = from + limit - 1;

    try {
        // --- Step 1: Fetch Reviews ---
        const { data: reviewsData, count: reviewsCount, error: reviewsError } = await supabase
            .from("reviews")
            .select(
                `game_id, user_id, rating, review_text, created_at, games(game_title, cover_url)`,
                { count: "exact" }
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (reviewsError) {
            throw new Error(`Database error fetching reviews: ${reviewsError.message}`);
        }
        
        // --- Step 2: Fetch Follower/Following Counts ---
        const { count: followersCount, error: followersError } = await supabase.from("followers").select("follower_id", { count: "exact", head: true }).eq("followed_id", user.id);
        const { count: followingCount, error: followingError } = await supabase.from("followers").select("followed_id", { count: "exact", head: true }).eq("follower_id", user.id);


        // --- Step 3: Return Response ---
        return NextResponse.json({
            reviews: reviewsData || [],
            totalReviews: reviewsCount ?? 0,
            followersCount: followersCount ?? 0,
            followingCount: followingCount ?? 0,
        });

    } catch (error: any) {
        console.error("API Error in /api/profile/me:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}