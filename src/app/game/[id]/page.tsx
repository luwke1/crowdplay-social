"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCurrentUser } from "@/api/auth";
import { getUserReview, upsertUserReview, getGameReviews } from "@/api/reviews";
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
	const [reviewText, setReviewText] = useState<string>("");

	const [gameReviews, setGameReviews] = useState<any[]>([]);

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
		async function fetchGameReviews() {
			try {
				const gameId = Number(id);
				if (isNaN(gameId)) {
					console.error("Invalid game ID:", id);
					return;
				}
				const reviews = await getGameReviews(gameId);
				setGameReviews(reviews);
			} catch (err) {
				console.error("Error fetching reviews:", err);
			}
		}

		fetchGameDetails();
		fetchUser();
		fetchGameReviews();
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
		if (reviews.length === 0) return "#ccc";
		const rating = reviews[0].rating;
		if (rating >= 7) return "#3ca62b";
		if (rating >= 4) return "#ffbf00";
		return "#e74c3c";
	};

	const setNewRating = async (rating: number, reviewText: string = "") => {
		if (!user || !game) {
			console.error("Missing user or game data.");
			return;
		}

		try {
			const coverUrl = game.cover
				? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
				: "";

			// If a review exists, update it. Otherwise, insert a new one.
			if (reviews.length > 0) {
				if (reviews[0].review_text != "" && reviewText == "") {
					reviewText = reviews[0].review_text;
				}
			}
			const existingReview = reviews.length > 0
				? { ...reviews[0], rating, review_text: reviewText }
				: { user_id: user.id, game_id: game.id, game_title: game.name, cover_url: coverUrl, rating, review_text: reviewText };

			// Update UI immediately
			setReviews([existingReview]);

			// Upsert review (update or insert)
			await upsertUserReview(user.id, game.id, game.name, coverUrl, rating, existingReview.review_text);
			console.log("Review successfully updated");

		} catch (err) {
			console.error("Error updating review:", err);
			setError("Failed to update review. Try again.");
		}
	};

	// Function to update review text state
	const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setReviewText(event.target.value);
	};


	return (
		<div className="game-page">
			{game ? (
				<>
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
								<textarea onChange={handleReviewChange} placeholder="Write your review (optional)..." />
								<button onClick={() => setNewRating(reviews[0].rating, reviewText)} disabled={!user || reviews.length <= 0 || reviewText.trim().length < 2}>Submit Review</button>
								{error && <p className="error">{error}</p>}
							</div>
						</div>


					</div>
					<div className="reviews-container">
						<h3 className="reviews-title">User Reviews</h3>
						{gameReviews.length > 0 ? (
							gameReviews.map((review) => (
								<div key={`${review.user_id}-${review.game_id}`} className="review-card">
									<div className="review-header">
										<h4 className="review-username">{review.username}</h4>
										<span className="review-rating">{review.rating}/10</span>
									</div>
									<p className="review-text">{review.review_text}</p>
								</div>
							))
						) : (
							<p className="no-reviews">No written reviews yet. Be the first to leave one!</p>
						)}
					</div>
				</>
			) : (
				<p>Loading game details...</p>
			)}
		</div>
	);
}
