"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { supabase } from "@/utils/supabase";
import "./game.css";

// Define Game Type
interface Game {
    id: number;
    name: string;
    cover?: { url: string };
    rating?: number;
    summary?: string;
}

export default function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [newReview, setNewReview] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGameDetails() {
            try {
                const response = await axios.get(`/api/igdb?id=${id}`);
                setGame(response.data);
            } catch (err) {
                console.error("Failed to fetch game:", err);
            }
        }

        fetchGameDetails();
    }, [id]);

    const handleSubmitReview = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError("You must be logged in to leave a review.");
            return;
        }

        const { error } = await supabase
            .from("reviews")
            .insert([{ game_id: id, user_id: user.id, content: newReview }]);

        if (error) {
            setError(error.message);
        } else {
            setNewReview("");
            setError(null);
        }
    };

    return (
        <div className="game-page">
            {game ? (
                <>
                    <h2>{game.name}</h2>
                    {game.cover && <img src={game.cover.url} alt={game.name} />}
                    <p>Rating: {game.rating ? Math.round(game.rating) : "N/A"}</p>
                    <p>{game.summary}</p>

                    <h3>Leave a Review</h3>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <button onClick={handleSubmitReview}>Submit Review</button>
                    {error && <p className="error">{error}</p>}
                </>
            ) : (
                <p>Loading game details...</p>
            )}
        </div>
    );
}