"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import './search.css';

export default function SearchPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [page, setPage] = React.useState(1);

    const fetchResults = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/igdb?q=${query}`);
            const data = await response.json();
            setResults(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (query) {
            fetchResults(page);
        }
    }, [page, query]);

    const handleGameClick = (gameId: number) => {
        router.push(`/game/${gameId}`);
    };

    return (
        <div className="main-body">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="search-results">
                    {results.map((game: any) => (
                        <div onClick={()=>handleGameClick(game.id)} className="result-card" key={game.id}>
                            <div>
                                {game.cover && game.cover.url ? (
                                    <img src={game.cover.url} alt={game.name} width="100" />
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
            {/* <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div> */}
        </div>
    );
};