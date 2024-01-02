import dotenv from "dotenv";

dotenv.config();
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function getAPIToken() {
  try {
    const body = `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`;
    apiToken = await axios.post(
      "https://accounts.spotify.com/api/token",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (e) {
    console.log(e.error);
  }
}

export default getAPIToken;
