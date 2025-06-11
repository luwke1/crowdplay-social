export const getRatingColor = (rating: number): string => {
    if (rating >= 7) return "#3ca62b";
    if (rating >= 4) return "#ffbf00";
    return "#e74c3c";
};
