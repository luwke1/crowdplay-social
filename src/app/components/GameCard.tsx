import React from "react";
import "./GameCard.css";
import Image from "next/image";

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
  const coverUrl = game.cover?.url
    ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
    : "/default-cover.jpg";
  return (
    <div className="game-card" onClick={() => onClick(game.id)}>
      {game.cover && (
        <Image
          className="game-cover"
          src={coverUrl}
          alt={game.name}
          width={110}
          height={160}
        />
      )}
    </div>
  );
};

export default GameCard;
