"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import './search.css';

export default function SearchPage() {
    const router = useRouter();

    // grabs the `q` query param from the URL (e.g. ?q=halo)
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1); // not used yet, but set up for future pagination

    // fetch results from backend route
    const fetchResults = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/igdb?q=${query}`);
            const data = await response.json();
            setResults(data); // store search results
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
        setLoading(false);
    };

    // fetch when page loads or query changes
    useEffect(() => {
        if (query) fetchResults(page);
    }, [page, query]);

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
                    <h1>Search Results for "{query}"</h1>

                    {/* render each result card */}
                    {results.map((game: any) => (
                        <div onClick={() => handleGameClick(game.id)} className="result-card" key={game.id}>
                            <div>
                                {game.cover?.url ? (
                                    <img
                                        src={game.cover.url.replace("t_thumb", "t_cover_big")}
                                        alt={game.name}
                                        width="100"
                                    />
                                ) : (
                                    <img src="/default-cover.jpg" alt="Default Cover" width="100" />
                                )}
                            </div>
                            <div className="result-info">
                                <h2>{game.name}</h2>
                                {/* <p>{game.summary}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
