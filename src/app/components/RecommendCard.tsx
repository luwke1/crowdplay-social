"use client";

import React from 'react';

import "./RecommendCard.css";

interface Recommendation {
    title: string;
    releaseDate: string;
    description: string;
}


export default function RecommendCard({ recommendation }: { recommendation: Recommendation }) {
    const { title, releaseDate, description } = recommendation;
    return (
        <>
        <div className='recommendationCard'>
            <div className='recTitle'>{title}</div>
            <div className='recReleaseDate'>{releaseDate}</div>
            <div className='recDescription'>{description}</div>
        </div>
        </>
    );
};