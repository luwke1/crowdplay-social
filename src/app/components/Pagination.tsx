interface PaginationProps {
    page: number;
    totalReviews: number;
    onPrev: () => void;
    onNext: () => void;
}

const Pagination = ({ page, totalReviews, onPrev, onNext }: PaginationProps) => (
    <div className="pagination">
        <button onClick={onPrev} disabled={page === 0}>Previous</button>
        <span>Page {page + 1} of {Math.ceil(totalReviews / 50)}</span>
        <button onClick={onNext} disabled={(page + 1) * 50 >= totalReviews}>Next</button>
    </div>
);

export default Pagination;