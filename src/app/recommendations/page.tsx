"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/api/auth";
import { getUserReviews } from "@/api/reviews";
import "./recommendations.css";

export default function RecommendationsPage() {

    return (
        <div className='recommendationsBody'>
            <h1>Generate Recommendations</h1>
            <div className='recSection'>
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
                    <div><input minLength={5} maxLength={80} placeholder='ex: list games that (feel like im in the future)'/></div>
                </div>
                <div>
                    <button className="generateBtn">
                        Generate
                    </button>
                </div>
            </div>
            <div className='recSection'>

            </div>
        </div>
    );
};