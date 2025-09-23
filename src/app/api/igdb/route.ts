import { NextResponse } from "next/server";
import { queryIgdb } from "@/services/igdbService";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page")) || 1;
        const offset = (page - 1) * 20;
        const gameId = url.searchParams.get("id");
        const searchTerm = url.searchParams.get("q");
        const requestType = url.searchParams.get("type");

        let queryBody = "";

        if (gameId) {
            queryBody = `fields name, cover.image_id, rating, summary, genres.name, release_dates.date; where id = ${gameId};`;
        } else if (searchTerm) {
            queryBody = `search "${searchTerm}"; fields name, cover.url, rating, rating_count, summary, genres.name, release_dates.date; where parent_game = null; limit 20; offset ${offset};`;
        } else if (requestType === "latest") {
            const twoMonthsAgo = Math.floor(Date.now() / 1000) - 15778800;
            // For recently released and popular games
            queryBody = `
        fields name, cover.url, rating, total_rating_count, first_release_date;
        where first_release_date > ${twoMonthsAgo} & first_release_date < ${Math.floor(Date.now() / 1000)} & total_rating_count > 25;
        sort total_rating_count desc;
        limit 20;
        offset ${offset};
    `;
        } else {
            // Default to popular games
            queryBody = `fields name, cover.url, rating, rating_count; where rating > 80 & rating_count > 50 & cover != null; sort rating_count desc; limit 20; offset ${offset};`;
        }

        const data = await queryIgdb("games", queryBody);

        // Handle single game result
        if (gameId) {
            if (!data || data.length === 0) {
                return NextResponse.json({ error: "Game not found" }, { status: 404 });
            }
            return NextResponse.json(data[0]);
        }

        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An internal server error occurred." },
            { status: 500 }
        );
    }
}