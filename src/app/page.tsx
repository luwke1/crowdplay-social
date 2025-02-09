"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./page.css"
import GameCard from "./components/GameCard";

// Game interface
interface Game {
  id: number;
  name: string;
  cover?: { url: string };
  rating?: number;
}

// Home page component
export default function HomePage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch popular games from the IGDB API
  useEffect(() => {
    async function getGames() {
      try {
        const response = await axios.get("/api/igdb");
        setGames(response.data);
      } catch (err: any) {
        console.error("Failed to fetch games:", err);
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    }

    getGames();
  }, []);

  // Handle game card click
  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`); // Redirect to the dynamic game page
  };

  return (
    <div className="popular-games main-body">
      <h2>Popular Games</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="game-list" style={{ display: "flex", flexWrap: "wrap" }}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} onClick={handleGameClick} />
          ))}
        </div>
      )}
    </div>
  );
}
