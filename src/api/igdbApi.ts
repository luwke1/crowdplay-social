import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4";

let accessToken = "";

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const response = await axios.post(TOKEN_URL, null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  accessToken = response.data.access_token;
  return accessToken;
};

export const fetchPopularGames = async () => {
  const token = await getAccessToken();

  const response = await axios.post(
    `${IGDB_URL}/games`,
    `fields name, cover.url, genres.name, release_dates.y, platforms.name, rating; 
     where rating > 80 & cover != null; 
     sort rating desc; 
     limit 10;`,
    {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};