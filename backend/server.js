require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React frontend can call this server
app.use(cors());

// IGDB API credentials
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4";

let accessToken = "";

// Function to get the IGDB API token
const getAccessToken = async () => {
  if (accessToken) return accessToken;

  try {
    const response = await axios.post(TOKEN_URL, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error getting IGDB token:", error);
    throw error;
  }
};

// Proxy endpoint to fetch the most popular and highly reviewed games
app.get("/api/popular-games", async (req, res) => {
  try {
    const token = await getAccessToken();

    // Modified query:
    // - Includes 'rating_count' to check the number of reviews.
    // - Filters for games with a rating above 80 and at least 50 reviews.
    // - Sorts the results by 'rating_count' in descending order.
    const query = `
      fields name, cover.url, rating, rating_count;
      where rating > 80 & rating_count > 50 & cover != null;
      sort rating_count desc;
      limit 10;
    `;

    const response = await axios.post(
      `${IGDB_URL}/games`,
      query,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching popular games:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
