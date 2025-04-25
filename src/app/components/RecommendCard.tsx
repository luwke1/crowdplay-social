"use client";

import React from 'react';

import "./RecommendCard.css";

interface Recommendation {
    title: string;
    release_date: string;
    reason: string;
}


export default function RecommendCard({ recommendation }: { recommendation: Recommendation }) {
    const { title, release_date, reason } = recommendation;
    console.log(recommendation)
    return (
        <div className='recommendationCard'>
            <img src="/" alt="" />
            <div className='recDetails'>
                <h4>{title} ({release_date})</h4>
                <p>{reason}</p>
            </div>
        </div>
    );
};