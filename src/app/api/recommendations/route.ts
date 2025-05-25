import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getUserReviews } from "@/api/reviews";

import axios from "axios";

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4";

let accessToken = "";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
    const { prompt, useProfile, userId } = await req.json();

    let sysInstruction = `You are a game recommendation assistant.
Only reply in JSON format. Return exactly 10 games, each with a title, year of release, and a non-spoiler reason why it fits the user's prompt. If no prompt, generate 10 random good games. 
Do not use regular text or any explanation.`;

    // If useProfile is true and userId is provided, modify the system instruction
    if (useProfile && userId) {
        sysInstruction = `You are a game recommendation assistant.
Only reply in JSON format. Return exactly 10 games, each with a title, year of release, and a non-spoiler reason why it fits the users disliked and liked games. If no prompt, generate 10 random good games. 
Do not use regular text or any explanation.`;

        const { data } = await getUserReviews(userId, 0, 1000, "rating", false);

        if (data.length !== 0) {
            let selectedReviews = data;

            // If there are more than 45 reviews, select a mix of high, mid, and low ratings
            if (data.length >= 45) {
                const high = data.slice(0, 15);
                const low = data.slice(-15);
                const mid = data.slice(
                    Math.floor((data.length - 15) / 2),
                    Math.floor((data.length - 15) / 2) + 15
                );
                selectedReviews = [...high, ...mid, ...low];
            }

            // Format the reviews for the system instruction
            const formattedReviews = selectedReviews
                .map(
                    (review: any) =>
                        `{Game Title: ${review.games?.game_title} | User Rating: (${review.rating}/10) | Review Text: "${review.review_text}"}`
                )
                .join(",\n");
            
            // Add the formatted reviews to the system instruction
            sysInstruction += `\n\nAlso, use the user's game reviews to inform your recommendations.
The user has rated the following games like this. Please analyze their reviews and ratings to decide on a game they might like, also take into account games they dislike and hate:\n${formattedReviews}`;
        }
    }

    try {
        // Generate content using Gemini AI
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            config: {
                systemInstruction: sysInstruction,
                responseMimeType: "application/json"
            },
        });

        // Check if the result is valid
        const responseText = await result.text;
        if (!responseText) {
            return NextResponse.json(
                { error: "No response from Gemini." },
                { status: 500 }
            );
        }
        // Parse the JSON response
        const jsonResponse = JSON.parse(responseText);
        let updatedGames = jsonResponse;

        if (Array.isArray(jsonResponse) && jsonResponse.length !== 0) {
            // Fetch IGDB data for each game title, this mostly just gets the cover image of a game
            updatedGames = await Promise.all(
                jsonResponse.map(async (game: any) => {
                    try {
                        const igdbData = await fetchIGDBData(game.title);

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
        }

        return NextResponse.json(updatedGames);
    } catch (error) {
        console.error("Error from Gemini:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations." },
            { status: 500 }
        );
    }
}


const getAccessToken = async () => {
    if (accessToken) return accessToken;
    const response = await axios.post(TOKEN_URL, null, {
        params: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "client_credentials",
        },
    });
    accessToken = response.data.access_token;
    return accessToken;
};

// Fetch IGDB data for a specific game title
async function fetchIGDBData(gameTitle: string) {
    const token = await getAccessToken();
    // Perform search using the provided query
    const query = `
        search "${gameTitle}";
        fields name, cover.url, rating, rating_count, summary, genres.name, release_dates.date;
        where cover != null & category = (0, 4, 8, 9) & parent_game = null & rating_count > 10;
    `;

    const response = await axios.post(`${IGDB_URL}/games`, query, {
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}
