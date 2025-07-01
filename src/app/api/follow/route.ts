import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST (Follow a user)
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { usernameToFollow } = await request.json();
    try {
        const { data: followedUser } = await supabase.from("profiles").select("id").eq("username", usernameToFollow).single();
        if (!followedUser) throw new Error("User not found");

        await supabase.from("followers").insert({ follower_id: user.id, followed_id: followedUser.id });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// DELETE (Unfollow a user)
export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const usernameToUnfollow = searchParams.get('username');

    try {
        const { data: followedUser } = await supabase.from("profiles").select("id").eq("username", usernameToUnfollow).single();
        if (!followedUser) throw new Error("User not found");

        await supabase.from("followers").delete().match({ follower_id: user.id, followed_id: followedUser.id });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}