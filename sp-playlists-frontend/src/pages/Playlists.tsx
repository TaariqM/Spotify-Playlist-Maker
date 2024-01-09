// import React from 'react'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Playlists = () => {
  const { codeParam } = useParams();
  const [accessToken, setAccessToken] = useState("");
  const [userSavedSongs, setUserSavedSongs] = useState({});
  const [songInfo, setSongInfo] = useState({
    track: [],
    genres: [],
  });
  const redirectURI: string = "http://localhost:5173/";
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;

  // console.log(codeParam);

  const handleOnClick = async (e: any) => {
    e.preventDefault();
    let savedSongs;
    // console.log("Test");
    try {
      savedSongs = await axios.get(
        "https://api.spotify.com/v1/me/tracks?limit=50",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(savedSongs.data.items);
      setUserSavedSongs(savedSongs.data.items);
    } catch (error) {
      console.log("Error fetching saved songs: ", error);
    }

    // getAllGenres(userSavedSongs);
    getAllGenres(savedSongs?.data.items);
  };

  const getAllGenres = async (songs: any) => {
    try {
      for (let i = 0; i < songs.length; i++) {
        const album = axios.get(
          `https://api.spotify.com/v1/albums/${songs[i].track.album.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(album);
      }
    } catch (error) {
      console.log("Error fetching alblums: ", error);
    }
  };

  useEffect(() => {
    // API Access Token
    const getAccessToken = async () => {
      try {
        if (!codeParam) {
          console.error("Authentication code is missing");
          return;
        }
        const formData = new URLSearchParams({
          code: codeParam || "",
          redirect_uri: redirectURI,
          grant_type: "authorization_code",
        });

        const authHeader = `Basic ${btoa(`${clientID}:${clientSecret}`)}`;
        await axios
          .post("https://accounts.spotify.com/api/token", formData.toString(), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: authHeader,
            },
          })
          .then((response) => {
            setAccessToken(response.data.access_token);
          });
      } catch (e: any) {
        console.log(e.error);
      }
    };

    getAccessToken();
  }, []);

  // console.log(accessToken);

  return (
    <div className="playlists">
      <div className="container">
        <div className="empty-playlists-container">
          <h1>Please Click On A Button To Generate A Playlist</h1>
        </div>

        <div className="generator-btn">
          <button onClick={handleOnClick}>Generate Playlists</button>
        </div>
      </div>
    </div>
  );
};

export default Playlists;
