import { NextResponse } from "next/server";
import axios from "axios";

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4";

const FALLBACK_COVER_URL = "";

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

const getReleaseYear = (unixTimestamp: any) => {
  if (!unixTimestamp) return "Unknown";
  return new Date(unixTimestamp * 1000).getFullYear();
};

export async function GET(req: Request) {
  try {
    const token = await getAccessToken();
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const offset = (page - 1) * 20;
    const gameId = url.searchParams.get("id");
    const searchTerm = url.searchParams.get("q"); // Search query
    const requestType = url.searchParams.get("type");

    if (gameId) {
      // Fetch details for a specific game
      const query = `
        fields name, cover.image_id, rating, summary, genres.name, release_dates.date;
        where id = ${gameId};
      `;
      const response = await axios.post(`${IGDB_URL}/games`, query, {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.length) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
      return NextResponse.json(response.data[0]);
    } else if (searchTerm) {
      // Perform search using the provided query
      const query = `
        search "${searchTerm}";
        fields name, cover.url, rating, rating_count, summary, genres.name, release_dates.date;
        where category = 0;
        limit 20;
        offset ${offset};
      `;
      const response = await axios.post(`${IGDB_URL}/games`, query, {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      });

      return NextResponse.json(response.data);
    } else if (requestType === "latest") {
      // Fetch the latest games with offset
      const query = `
        fields name, cover.url, rating, summary, genres.name, release_dates.human, release_dates.date;
        where first_release_date > ${Math.floor(Date.now() / 1000) - 2592000} & cover != null;
        sort popularity desc;
        limit 20;
        offset ${offset};
      `;
      const response = await axios.post(`${IGDB_URL}/games`, query, {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      });
      return NextResponse.json(response.data);
    } else {
      // Fetch popular games with offset
      const query = `
        fields name, cover.url, rating, rating_count;
        where rating > 80 & rating_count > 50 & cover != null;
        sort rating_count desc;
        limit 20;
        offset ${offset};
      `;
      const response = await axios.post(`${IGDB_URL}/games`, query, {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      });
      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    console.error("IGDB API Error:", error.response ? error.response.data : error.message);
    return NextResponse.json(
      { error: error.response ? error.response.data : "Internal Server Error" },
      { status: 500 }
    );
  }
}
