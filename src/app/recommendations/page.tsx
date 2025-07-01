"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import RecommendCard from "@/components/RecommendCard";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import "./recommendations.css";

// structure of recommendation data
type GameRecommendation = {
    title: string;
    year: string;
    reason: string;
    igdb: {
        cover?: { url: string; };
    } | null;
};

export default function RecommendationsPage() {
    const [prompt, setPrompt] = useState("");
    const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useProfile, setUseProfile] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        const checkInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        const stored = localStorage.getItem("crowdplay_recommendations");
        if (stored) {
            const storedRecs = JSON.parse(stored) as GameRecommendation[];
            setRecommendations(storedRecs);
        }

        return () => subscription.unsubscribe();
    }, []);

    // main function to generate recs based on prompt
    async function generateRecommendations() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/recommendations", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, useProfile }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "An error occurred.");
            }
            const data = await res.json();
            localStorage.setItem("crowdplay_recommendations", JSON.stringify(data));
            setRecommendations(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="recommendationsBody">
            <h1>Generate Recommendations</h1>
            <div className="recSettings">
                {loading && <div className="loadingBarContainer"><div className="loadingBar"></div></div>}
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <div className="searchArea">
                    <input onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., games with a great story" disabled={loading} value={prompt} />
                </div>
                <FormControlLabel control={<Switch checked={useProfile} onChange={(e) => setUseProfile(e.target.checked)} disabled={!isLoggedIn || loading} />} label="Generate Based on Your Reviews" />
                <button
                    className="generateBtn"
                    disabled={!isLoggedIn || loading || prompt.length < 5}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
                {!isLoggedIn && (
                    <p style={{ marginTop: '10px', color: '#aaa' }}>Please log in to generate recommendations.</p>
                )}
            </div>
            <div className="recSection">
                {recommendations.map((game, index) => (
                    <RecommendCard key={`${game.title}-${index}`} recommendation={game} />
                ))}
            </div>
        </div>
    );
}