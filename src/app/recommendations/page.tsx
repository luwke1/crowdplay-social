"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecommendCard from "@/components/RecommendCard";
import "./recommendations.css";

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


  useEffect(() => {
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
        body: JSON.stringify({ prompt }),
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

        <div>
          <button
            className="generateBtn"
            onClick={generateRecommendations}
            disabled={loading || prompt.length < 5}
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
