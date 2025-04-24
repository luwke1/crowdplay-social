import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
    const { prompt } = await req.json();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            config: {
                systemInstruction: `You are a game recommendation assistant. 
                Only reply in JSON format. Return exactly 10 games, each with a title, release date, and a non-spoiler reason why it fits. 
                Do not use regular text or any explanation.`,
            },
        });

        return NextResponse.json({ response: response.text });
    } catch (error) {
        console.error("Error from Gemini:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations." },
            { status: 500 }
        );
    }
}
