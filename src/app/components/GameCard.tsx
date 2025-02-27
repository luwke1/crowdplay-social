import React from "react";
import "./GameCard.css";

interface Game {
  id: number;
  name: string;
  cover?: { url: string };
  rating?: number;
}

interface GameCardProps {
  game: Game;
  onClick: (gameId: number) => void;
}

// GameCard component
const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div className="game-card" onClick={() => onClick(game.id)}>
      {game.cover && (
        <img
          className="game-cover"
          src={game.cover.url.replace("t_thumb", "t_cover_big")}
          alt={game.name}
        />
      )}
    </div>
  );
};

export default GameCard;
