import Image from 'next/image';
import { getRatingColor } from "@/utils/ratingColor";

// Added a specific interface for the review prop
interface Review {
    game_id: number;
    user_id: string;
    rating: number;
    games: {
        cover_url: string | null;
        game_title: string;
    } | null;
}

interface ReviewCardProps {
    review: Review;
    onDelete?: (gameId: number) => void;
    onClick: (gameId: number) => void;
}

function ReviewCard({ review, onDelete, onClick }: ReviewCardProps) {
    const coverUrl = review.games?.cover_url || '/default-cover.png';
    const gameTitle = review.games?.game_title || 'Unknown Game';

    return (
        <div className="review-card" key={`${review.user_id}-${review.game_id}`}>
            {onDelete && (
                <Image
                    onClick={() => onDelete(review.game_id)}
                    className="delete-icon"
                    src="/deleteIcon.svg"
                    alt="Delete Icon"
                    width={24}
                    height={24}
                />
            )}
            <Image
                onClick={() => onClick(review.game_id)}
                className="card-cover"
                src={coverUrl}
                alt={gameTitle}
                width={120}
                height={160}
            />
            <div
                className="rating-badge"
                style={{ backgroundColor: getRatingColor(review.rating) }}
            >
                {review.rating}
            </div>
        </div>
    );
}

export default ReviewCard;