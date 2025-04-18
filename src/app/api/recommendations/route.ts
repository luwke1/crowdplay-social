import axios from 'axios';
import { NextResponse } from 'next/server';

import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function generateRecommendations(prompt: string, retries = 0) {
    try {
        // Make API call to OpenAI
        const completion = openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            messages: [
                { "role": "user", "content": prompt },
                { "role": "system", "content": "You are a game recommendation assistant that only speaks JSON. List 10 games based on the user prompt and return JSON in the format of the game's title, release date, and non-spoiler description of why it fits. Do not write normal text." },
            ],
        });
        completion.then((result) => console.log(result.choices[0].message));

    } catch (error) {
        console.error("Error generating games:", error);
    }
}