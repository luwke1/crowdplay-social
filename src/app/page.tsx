"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./page.css";
import GameCard from "./components/GameCard";

interface Game {
  id: number;
  name: string;
  cover?: { url: string };
  rating?: number;
}

export default function HomePage() {
  const router = useRouter();

  // Separate state for popular games pagination
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [popularPage, setPopularPage] = useState(1);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState("");

  // Separate state for latest games pagination
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [latestPage, setLatestPage] = useState(1);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [latestError, setLatestError] = useState("");

  // Fetch popular games for the current page
  useEffect(() => {
    async function getPopularGames() {
      setLoadingPopular(true);
      try {
        const response = await axios.get(`/api/igdb?page=${popularPage}`);
        setPopularGames(response.data);
      } catch (err: any) {
        console.error("Failed to fetch popular games:", err);
        setPopularError("Failed to load popular games.");
      } finally {
        setLoadingPopular(false);
      }
    }
    getPopularGames();
  }, [popularPage]);

  // Fetch latest games for the current page
  useEffect(() => {
    async function getLatestGames() {
      setLoadingLatest(true);
      try {
        const response = await axios.get(`/api/igdb?type=latest&page=${latestPage}`);
        setLatestGames(response.data);
      } catch (err: any) {
        console.error("Failed to fetch latest games:", err);
        setLatestError("Failed to load latest games.");
      } finally {
        setLoadingLatest(false);
      }
    }
    getLatestGames();
  }, [latestPage]);

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="main-body">
      {/* Popular Games Section */}
      <div className="game-list-container">
        <h2>Popular Games</h2>
        {popularError && <p>{popularError}</p>}
        <div className="game-list">
          {loadingPopular ? (
            <p>Loading...</p>
          ) : (
            popularGames.map((game) => (
              <GameCard key={game.id} game={game} onClick={handleGameClick} />
            ))
          )}
        </div>
        <div className="pagination-buttons">
          <button disabled={popularPage === 1} onClick={() => setPopularPage(popularPage - 1)}>
            Previous
          </button>
          <button onClick={() => setPopularPage(popularPage + 1)}>Next</button>
        </div>
      </div>

      {/* Latest Games Section */}
      <div className="game-list-container">
        <h2>Latest Games</h2>
        {latestError && <p>{latestError}</p>}
        <div className="game-list">
          {loadingLatest ? (
            <p>Loading...</p>
          ) : (
            latestGames.map((game) => (
              <GameCard key={game.id} game={game} onClick={handleGameClick} />
            ))
          )}
        </div>
        <div className="pagination-buttons">
          <button disabled={latestPage === 1} onClick={() => setLatestPage(latestPage - 1)}>
            Previous
          </button>
          <button onClick={() => setLatestPage(latestPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}