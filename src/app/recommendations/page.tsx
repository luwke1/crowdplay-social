"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecommendCard from "@/components/RecommendCard";
import { getCurrentUser } from "@/api/auth";
import "./recommendations.css";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

type GameRecommendation = {
  title: string;
  year: string;
  reason: string;
  igdb: any; // Optional IGDB data
};

export default function RecommendationsPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [useProfile, setUseProfile] = useState(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);
    }

    fetchUser();

    const stored = localStorage.getItem("crowdplay_recommendations");

    if (stored) {
      setRecommendations(JSON.parse(stored));
    } else {
      setRecommendations([]);
    }
  }, []);

  async function generateRecommendations() {
    try {
      setLoading(true);
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, useProfile, userId: user?.id || null }),
      });

      if (!res.ok) {
        console.error("Failed to fetch recommendations:", res.statusText);
        return;
      }

      const data = await res.json();
      localStorage.setItem("crowdplay_recommendations", JSON.stringify(data));
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recommendationsBody">
      <h1>Generate Recommendations</h1>
      <div className="recSettings">
        {/* Loading bar */}
        {loading && (
          <div className="loadingBarContainer">
            <div className="loadingBar"></div>
          </div>
        )}



        {/* Search input */}
        <div className="searchArea">
          <div>
            <input
              onChange={(e) => setPrompt(e.target.value)}
              minLength={5}
              maxLength={80}
              placeholder="ex: list games that (feel like im in the future)"
              disabled={loading}
              value={prompt}
            />
          </div>

        </div>
        <FormControlLabel onChange={() => setUseProfile(prev => !prev)} control={<Switch />} label="Generate Based on Your Reviews" />

        <div>
          <button
            className="generateBtn"
            onClick={generateRecommendations}
            disabled={
              loading ||
              prompt.length < 5 ||
              (useProfile && !user) // disable if no logged in user
            }
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      <div className="recSection">
        {recommendations.map((game) => (
          <RecommendCard key={game.title} recommendation={game} />
        ))}
      </div>
    </div>
  );
}
