import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { buildSystemInstruction } from "@/utils/instructionBuilder";
import { reviewsService } from "@/services/reviewsService";
import { queryIgdb } from "@/services/igdbService";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
    const supabase = await createClient();

    // Securely get the user session on the server
    const { data: { user } } = await supabase.auth.getUser();

    const { prompt, useProfile } = await req.json();

    if (typeof prompt !== 'string' || prompt.trim() === '') {
        return NextResponse.json({ error: "A valid prompt is required." }, { status: 400 });
    }

    let reviewsFormatted: string | undefined;

    if (useProfile) {
        if (!user) {
            // If user wants to use profile but isn't logged in, return an error
            return NextResponse.json(
                { error: "You must be logged in for profile-based recommendations." },
                { status: 401 }
            );
        }
        // User is logged in, proceed to fetch their reviews
        const reviews = await reviewsService.fetchForUser(user.id);
        reviewsFormatted = reviewsService.formatReviews(reviews);
    }

    const systemInstruction = buildSystemInstruction({ useProfile, formattedReviews: reviewsFormatted });

    try {
        // Generate content using Gemini AI
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json"
            },
        });

        // Check if the result is valid
        const responseText = await result.text;
        console.log(responseText);
        if (!responseText) {
            return NextResponse.json(
                { error: "No valid response from Gemini." },
                { status: 500 }
            );
        }
        // Parse the JSON response
        const jsonResponse = JSON.parse(responseText);

        if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
            return NextResponse.json(jsonResponse);
        }

        // Fetch IGDB data for each game title, this mostly just gets the cover image of a game
        const updatedGames = await Promise.all(
            jsonResponse.map(async (game: { title: string }) => {
                try {
                    // Create a search query for the specific game title
                    const igdbQuery = `search "${game.title}"; fields name, cover.url; where parent_game = null; limit 1;`;
                    const igdbData = await queryIgdb("games", igdbQuery);

                    // Attach IGDB data to the game object
                    return {
                        ...game,
                        igdb: igdbData?.[0] || null,
                    };
                } catch (error) {
                    console.error(`Failed to fetch IGDB info for ${game.title}`, error);
                    return {
                        ...game,
                        igdb: null,
                    };
                }
            })
        );

        return NextResponse.json(updatedGames);

    } catch (error) {
        console.error("Error from Gemini:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations." },
            { status: 500 }
        );
    }
}