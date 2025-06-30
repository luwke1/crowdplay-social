import axios from "axios";

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4";

// Getting access token in a serverless environment, this is more reliable than in-memory caching.
async function getAccessToken() {
    try {
        const response = await axios.post(TOKEN_URL, null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "client_credentials",
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to retrieve IGDB access token:", error);
        throw new Error("Could not retrieve access token.");
    }
}

// A centralized function for making requests to the IGDB API
export async function queryIgdb(endpoint: string, query: string) {
    const token = await getAccessToken();

    try {
        const response = await axios.post(`${IGDB_URL}/${endpoint}`, query, {
            headers: {
                "Client-ID": CLIENT_ID!,
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("IGDB API Query Error:", error);
        throw new Error("Failed to query IGDB API.");
    }
}