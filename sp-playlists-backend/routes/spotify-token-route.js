import express from "express";
import getAPIToken from "../controllers/spotify-api-controller";

const router = express();

// Route for POST request to retrieve the api token from Spotify
router.post("/token", getAPIToken);
