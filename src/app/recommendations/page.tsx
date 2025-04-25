"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/api/auth";
import { getUserReviews } from "@/api/reviews";
import RecommendCard from "@/components/RecommendCard";
import "./recommendations.css";

export default function RecommendationsPage() {
    const [prompt, setPrompt] = useState("");
    // const [recommendations, setRecommendations] = useState([]);
    const recommendations = [
        {
          "title": "The Witcher 3: Wild Hunt",
          "release_date": "2015-05-19",
          "reason": "A sprawling open-world RPG with a compelling story and memorable characters."
        },
        {
          "title": "Red Dead Redemption 2",
          "release_date": "2018-10-26",
          "reason": "An epic Western tale with stunning visuals and a deeply immersive world."
        },
        {
          "title": "The Legend of Zelda: Breath of the Wild",
          "release_date": "2017-03-03",
          "reason": "A revolutionary open-world adventure game with incredible freedom and exploration."
        },
        {
          "title": "Elden Ring",
          "release_date": "2022-02-25",
          "reason": "Vast open world souls like game with a lot of exploration."
        },
        {
          "title": "Minecraft",
          "release_date": "2011-11-18",
          "reason": "Sandbox game with near infinite possibilities."
        },
        {
          "title": "Grand Theft Auto V",
          "release_date": "2013-09-17",
          "reason": "A massive open-world crime game with a gripping story and plenty of mayhem."
        },
        {
          "title": "Cyberpunk 2077",
          "release_date": "2020-12-10",
          "reason": "An immersive open-world RPG set in a futuristic dystopian city."
        },
        {
          "title": "God of War",
          "release_date": "2018-04-20",
          "reason": "A stunning action-adventure game with a powerful story and visceral combat."
        },
        {
          "title": "Horizon Zero Dawn",
          "release_date": "2017-02-28",
          "reason": "A unique open-world game with robotic creatures and a compelling mystery."
        },
        {
          "title": "Divinity: Original Sin 2",
          "release_date": "2017-09-14",
          "reason": "A deep and engaging RPG with turn-based combat and a rich narrative."
        }
      ];

    async function generateRecommendations() {
        // const res = await fetch("/api/recommendations", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ prompt: prompt }),
        // });
        // const data = await res.json();
        // console.log(data);
    }

    return (
        <div className='recommendationsBody'>
            <h1>Generate Recommendations</h1>
            <div className='recSettings'>
                {/* Loading animation */}
                {/* <div style={{ display: loadDisplay }} className="center">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div> */}
                {/* Search input */}
                <div className='searchArea'>
                    <div><input onChange={(e) => {setPrompt(e.target.value)}} minLength={5} maxLength={80} placeholder='ex: list games that (feel like im in the future)'/></div>
                </div>
                <div>
                    <button className="generateBtn" onClick={generateRecommendations}>
                        Generate
                    </button>
                </div>
            </div>
            <div className='recSection'>
                {recommendations.map((game, index) => (
                    <RecommendCard key={game.title} recommendation={game}/>
                ))}
            </div>
        </div>
    );
};