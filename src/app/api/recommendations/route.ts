import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
    const { prompt } = await req.json();

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            config: {
                systemInstruction: `You are a game recommendation assistant. 
                Only reply in JSON format. Return exactly 10 games, each with a title, year of release, and a non-spoiler reason why it fits the users prompt. If no prompt, generate 10 random good games. 
                Do not use regular text or any explanation.`,
                responseMimeType: "application/json"
            },
        });

        const responseText = await result.text;
        if (!responseText) {
            return NextResponse.json(
                { error: "No response from Gemini." },
                { status: 500 }
            );
        }
        const jsonResponse = JSON.parse(responseText);
        

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("Error from Gemini:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations." },
            { status: 500 }
        );
    }
}
