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
        if (popularPage === 1) {
          setPopularGames(response.data); // replace on first page load
        } else {
          setPopularGames(prev => [...prev, ...response.data]); // append on next pages
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch games:", err);
          setPopularError("Failed to load games.");
        }
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
        if (latestPage === 1) {
          setLatestGames(response.data);
        } else {
          setLatestGames(prev => [...prev, ...response.data]);
        }
      } catch (err) {
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
        <hr />
        {popularError && <p>{popularError}</p>}
        <div className="game-list">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} onClick={handleGameClick} />
          ))}
        </div>
        {loadingPopular && <p className="loadingGames">Loading more games...</p>}
        <div className="pagination-buttons">
          {/* <button disabled={popularPage === 1} onClick={() => setPopularPage(popularPage - 1)}>
            Previous
          </button> */}
          <button onClick={() => setPopularPage(popularPage + 1)}>Load More</button>
        </div>
      </div>

      {/* Latest Games Section */}
      <div className="game-list-container">
        <h2>Latest Games</h2>
        <hr />
        {latestError && <p>{latestError}</p>}
        <div className="game-list">
          {latestGames.map((game) => (
            <GameCard key={game.id} game={game} onClick={handleGameClick} />
          ))}

        </div>
        {loadingLatest && <p className="loadingGames">Loading more games...</p>}
        <div className="pagination-buttons">
          <button onClick={() => setLatestPage(latestPage + 1)}>Load More</button>
        </div>
      </div>
    </div>
  );
}