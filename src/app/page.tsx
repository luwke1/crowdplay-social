"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  rating?: number;
}

export default function HomePage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="popular-games main-body">
      <h2>Popular Games</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="game-list">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => handleGameClick(game.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={game.cover?.url.replace("t_thumb", "t_cover_big")}
                alt={game.name}
              />
              <h3>{game.name}</h3>
              <p>⭐ {game.rating ? Math.round(game.rating) : "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}