const ProfileStats = ({ followers, following, reviews }: { followers: number, following: number, reviews: number }) => (
    <div className="profile-stats">
        <div><span>{followers}</span><span>Followers</span></div>
        <div><span>{following}</span><span>Following</span></div>
        <div><span>{reviews}</span><span>Reviews</span></div>
    </div>
);
export default ProfileStats;