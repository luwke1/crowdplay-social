"use client";

import React, { use } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import "./RecommendCard.css";

interface Recommendation {
    title: string;
    year: string;
    reason: string;
    igdb: any; // Optional IGDB data
}


export default function RecommendCard({ recommendation }: { recommendation: Recommendation }) {
    const { title, year, reason, igdb } = recommendation;
    const sourceImage = igdb?.cover?.url.replace("t_thumb", "t_cover_big") || "/default-profile.jpg";
    const router = useRouter();

    const handleGameClick = () => {
        console.log("Game clicked:", title);
        router.push(`/search?q=${title}`);
    };

    return (
        <div className='recommendationCard' onClick={handleGameClick}>
            <img src={sourceImage} alt="" />
            <div className='recDetails'>
                <h4>{title} ({year})</h4>
                <p>{reason}</p>
            </div>
        </div>
    );
};