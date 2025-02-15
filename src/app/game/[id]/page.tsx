"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserReview, getCurrentUser, upsertUserReview } from "@/api/auth";
import axios from "axios";
import "./game.css";

interface Game {
	id: number;
	name: string;
	cover?: { image_id: string };
	rating?: number;
	summary?: string;
}

export default function GamePage() {
	const { id } = useParams();
	const [game, setGame] = useState<Game | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);
	const [reviews, setReviews] = useState<any[]>([]);

	const getHighResImage = (imageId: string, size: string = "1080p") => {
		return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
	};

	useEffect(() => {
		async function fetchGameDetails() {
			try {
				const response = await axios.get(`/api/igdb?id=${id}`);
				setGame(response.data);
			} catch (err) {
				console.error("Failed to fetch game:", err);
			}
		}
		async function fetchUser() {
			try {
				const loggedInUser = await getCurrentUser();
				if (loggedInUser) {
					setUser(loggedInUser);
				} else {
					console.error("No logged-in user found.");
				}
			} catch (err) {
				console.error("Error fetching user:", err);
			}
		}

		fetchGameDetails();
		fetchUser();
	}, [id]);

	useEffect(() => {
		async function fetchUserReview() {
			try {
				if (!user || !game) return;
	
				const data = await getUserReview(user.id, game.id);
	
				// Only update if no existing review is in state (prevents flickering)
				if (reviews.length === 0) {
					setReviews(data ? data : []);
				}
			} catch (err) {
				console.error("Error fetching user review:", err);
			}
		}
	
		if (game && user) {
			fetchUserReview();
		}
	
	}, [game, user]);

	// Get rating color or default to gray if no review exists
	const getRatingColor = () => {
		if (reviews.length === 0) return "#ccc"; // Gray if no review
		const rating = reviews[0].rating;
		if (rating >= 7) return "#3ca62b";
		if (rating >= 4) return "#ffbf00";
		return "#e74c3c";
	};

	const setNewRating = async (rating: number) => {
		if (!user || !game) {
			console.error("Missing user or game data.");
			return;
		}
	
		try {
			// If a review exists, update it. Otherwise, insert a new one.
			const existingReview = reviews.length > 0 
    			? { ...reviews[0], rating }  
    			: { user_id: user.id, game_id: game.id, rating, review_text: "" };
			
			// Update UI immediately
			setReviews([existingReview]);

			// Upsert review (update or insert)
			await upsertUserReview(user.id, game.id, rating, existingReview.review_text);
			console.log("Review successfully updated");

		} catch (err) {
			console.error("Error updating review:", err);
			setError("Failed to update review. Try again.");
		}
	};	

	return (
		<div className="game-page">
			{game ? (
				<div className="game-container">
					{/* Left Column: Game Cover */}
					<div className="game-cover">
						{game.cover && <img src={getHighResImage(game.cover.image_id)} alt={game.name} />}
					</div>

					{/* Middle Column: Title & Description */}
					<div className="game-info">
						<h2 className="game-title">{game.name}</h2>
						<p className="game-summary">{game.summary}</p>
					</div>

					{/* Right Column: Rating & Review Section */}
					<div className="game-actions">
						<h3 className="rating-title">My Score</h3>

						{/* Metacritic-Style Rating System */}
						<div className="rating-container">
							{/* Score Circle */}
							<div className="rating-circle" style={{ backgroundColor: getRatingColor() }}>
								{reviews.length > 0 ? reviews[0].rating : "-"}
							</div>

							{/* Rating Bar */}
							<div className="rating-bar">
								{[...Array(10)].map((_, index) => (
									<div
										key={index}
										className={`rating-box ${reviews.length > 0 && index < reviews[0].rating ? "filled" : ""}`}
										onClick={() => setNewRating(index + 1)}
									/>
								))}
							</div>
						</div>

						{/* Review Form */}
						<div className="review-form">
							<h3>Leave a Review</h3>
							<textarea placeholder="Write your review (optional)..." />
							<button>Submit Review</button>
							{error && <p className="error">{error}</p>}
						</div>
					</div>
				</div>
			) : (
				<p>Loading game details...</p>
			)}
		</div>
	);
}
