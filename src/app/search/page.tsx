"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import './search.css';

// Added specific type for search results
interface GameResult {
    id: number;
    name: string;
    cover?: {
        url: string;
    };
}

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<GameResult[]>([]);

    // fetch results from backend route
    const fetchResults = useCallback(async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/igdb?q=${query}`);
            const data = await response.json();
            setResults(data); // store search results
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
        setLoading(false);
    }, [query]);

    // fetch when page loads or query changes
    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    // navigate to clicked game page
    const handleGameClick = (gameId: number) => {
        router.push(`/game/${gameId}`);
    };

    return (
        <div className="main-body">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="search-results">
                    <h1>Search Results for &quot;{query}&quot;</h1>

                    {results.map((game) => (
                        <div onClick={() => handleGameClick(game.id)} className="result-card" key={game.id}>
                            <Image
                                src={game.cover?.url.replace("t_thumb", "t_cover_big") || "/default-cover.jpg"}
                                alt={game.name || "Game cover"}
                                width={100}
                                height={128}
                            />
                            <div className="result-info">
                                <h2>{game.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};