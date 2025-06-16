"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import RecommendCard from "@/components/RecommendCard";

// MUI for toggle switch
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import "./recommendations.css";

// structure of recommendation data
type GameRecommendation = {
    title: string;
    year: string;
    reason: string;
    igdb: any; // holds IGDB game info (e.g., cover, id)
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

        // Check for session on initial load
        const checkInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkInitialSession();

        // set login state on auth change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        // restore last recs from localStorage if available
        const stored = localStorage.getItem("crowdplay_recommendations");
        if (stored) setRecommendations(JSON.parse(stored));

        return () => subscription.unsubscribe(); // cleanup on unmount
    }, []);

    // main function to generate recs based on prompt (+ profile if enabled)
    async function generateRecommendations() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/recommendations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, useProfile }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "An error occurred while generating recommendations.");
            }

            const data = await res.json();

            // cache recs in localStorage for persistence
            localStorage.setItem("crowdplay_recommendations", JSON.stringify(data));
            setRecommendations(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="recommendationsBody">
            <h1>Generate Recommendations</h1>

            <div className="recSettings">
                {/* loading bar */}
                {loading && (
                    <div className="loadingBarContainer">
                        <div className="loadingBar"></div>
                    </div>
                )}

                {/* error display */}
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                {/* user prompt input */}
                <div className="searchArea">
                    <input
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., games with a great story"
                        disabled={loading}
                        value={prompt}
                    />
                </div>

                {/* toggle for profile-based recommendations */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={useProfile}
                            onChange={(e) => setUseProfile(e.target.checked)}
                            disabled={!isLoggedIn || loading}
                        />
                    }
                    label="Generate Based on Your Reviews"
                />

                {/* generate button */}
                <button
                    className="generateBtn"
                    onClick={generateRecommendations}
                    disabled={loading || prompt.length < 5 || (useProfile && !isLoggedIn)}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>

            {/* list of recommended games */}
            <div className="recSection">
                {recommendations.map((game, index) => (
                    <RecommendCard key={`${game.title}-${index}`} recommendation={game} />
                ))}
            </div>
        </div>
    );
}