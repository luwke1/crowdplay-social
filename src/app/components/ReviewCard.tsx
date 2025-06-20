import { getRatingColor } from "@/utils/ratingColor";

interface ReviewCardProps {
    review: any;
    onDelete?: (gameId: number) => void;
    onClick: (gameId: number) => void;
}

function ReviewCard({ review, onDelete, onClick }: ReviewCardProps) {
    const coverUrl = review.games?.cover_url || '/default-cover.jpg'; // Use a default image
    const gameTitle = review.games?.game_title || 'Unknown Game';

    return (
        <div className="review-card" key={`${review.user_id}-${review.game_id}`}>
            {onDelete && (
                <img onClick={() => onDelete(review.game_id)} className="delete-icon" src="/deleteIcon.svg" alt="Delete Icon" width={24} height={24} />
            )}
            <img
                onClick={() => onClick(review.game_id)}
                className="card-cover"
                src={coverUrl}
                alt={gameTitle}
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