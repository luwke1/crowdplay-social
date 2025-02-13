import { NextResponse } from "next/server";
import axios from "axios";

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

export async function GET(req: Request) {
  try {
    const token = await getAccessToken();
    const url = new URL(req.url);
    const gameId = url.searchParams.get("id");

    if (gameId) {
      // Fetch details for a specific game
      const query = `
        fields name, cover.image_id, rating, summary, genres.name, release_dates.human;
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
    } else {
      // Fetch popular games
      const query = `
        fields name, cover.url, rating, rating_count;
        where rating > 80 & rating_count > 50 & cover != null;
        sort rating_count desc;
        limit 20;
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}