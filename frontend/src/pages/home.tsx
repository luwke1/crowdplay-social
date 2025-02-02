// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPopularGames } from "../api/igdbApi.ts";

const Home = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await fetchPopularGames();
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, []);

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
              onClick={() => navigate(`/game/${game.id}`)}
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
};

export default Home;