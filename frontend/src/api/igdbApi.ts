import axios from "axios";

// Access the backend URL from your .env file (e.g., REACT_APP_BACKEND_URL=http://localhost:5000)
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const fetchPopularGames = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/popular-games`);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular games:", error);
    throw error;
  }
};