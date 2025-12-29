"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "./RecommendCard.css";

interface IgdbData {
    cover?: { url: string; };
}

interface Recommendation {
    title: string;
    year_released: string;
    reason: string;
    igdb: IgdbData | null;
}


export default function RecommendCard({ recommendation }: { recommendation: Recommendation }) {
    const { title, year_released, reason, igdb } = recommendation;
    const router = useRouter();

    let sourceImage = "/default-cover.png";
    if (igdb?.cover?.url) {
        sourceImage = igdb.cover.url.startsWith("//")
            ? `https:${igdb.cover.url}`
            : igdb.cover.url;
        sourceImage = sourceImage.replace("t_thumb", "t_cover_big");
    }

    const handleGameClick = () => {
        console.log("Game clicked:", title);
        router.push(`/search?q=${title}`);
    };

    return (
        <div className='recommendationCard' onClick={handleGameClick}>
            <Image src={sourceImage} alt={`Cover art for ${title}`} width={100} height={128} />
            <div className='recDetails'>
                <h4>{title} ({year_released})</h4>
                <p>{reason}</p>
            </div>
        </div>
    );
};