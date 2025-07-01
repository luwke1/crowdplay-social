import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const supabase = await createClient();
    const { username } = await params;

    // get pagination info from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = 50;
    const from = page * limit;
    const to = from + limit - 1;

    try {
        // get profile's internal user ID
        const { data: profileUser, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", username)
            .single();

        if (profileError) throw new Error("User not found.");
        const userId = profileUser.id;

        // fetch reviews, followers, and following counts in parallel
        const [reviewsRes, followersRes, followingRes] = await Promise.all([
            supabase.from("reviews").select(
                `game_id, user_id, rating, review_text, created_at, games(game_title, cover_url)`,
                { count: "exact" }
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(from, to),

            supabase.from("followers")
                .select("follower_id", { count: "exact", head: true })
                .eq("followed_id", userId),

            supabase.from("followers")
                .select("followed_id", { count: "exact", head: true })
                .eq("follower_id", userId),
        ]);

        // check if the current logged-in user is following this profile
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        let isFollowing = false;
        if (loggedInUser && loggedInUser.id !== userId) {
            const { data: followCheck } = await supabase
                .from("followers")
                .select()
                .eq("follower_id", loggedInUser.id)
                .eq("followed_id", userId)
                .maybeSingle();
            isFollowing = !!followCheck;
        }

        // return everything needed for profile page
        return NextResponse.json({
            id: userId,
            reviews: reviewsRes.data || [],
            totalReviews: reviewsRes.count ?? 0,
            followersCount: followersRes.count ?? 0,
            followingCount: followingRes.count ?? 0,
            isFollowing,
        });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
