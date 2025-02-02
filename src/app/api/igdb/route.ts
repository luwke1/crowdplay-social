// src/app/api/igdb/route.ts
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

export async function GET() {
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

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}