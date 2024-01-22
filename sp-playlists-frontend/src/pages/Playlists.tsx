// import React from 'react'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import genreToSongMatcher from "../functions/GenreToSongMatcher";
import mapToArrayConverter from "../functions/MapToArrayConverter";
import Playlists_Card from "../components/Playlists_Card";
import "../css/playlists.css";

const Playlists = () => {
  const { codeParam } = useParams();
  const [accessToken, setAccessToken] = useState("");
  const [songInfo, setSongInfo] = useState({
    track: [],
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
      console.log("All User Saved Songs: ", savedSongs.data.items);
      // setUserSavedSongs(savedSongs.data.items);
      getAllArtists(savedSongs.data.items);
    } catch (error) {
      console.log("Error fetching saved songs: ", error);
    }
  };

  const getAllArtists = async (songs: any) => {
    try {
      // console.log("User Saved Songs From getAllArtists() Function: ", songs);
      const updatedSongInfo = await Promise.all(
        songs.map(async (song: any) => {
          const artistsIds: string[] = [];
          const artistsInfo = await Promise.all(
            song.track.artists.map(async (artist: any) => {
              artistsIds.push(artist.id);
              const artistDetails = await axios.get(
                `https://api.spotify.com/v1/artists/${artist.id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              // console.log("Artist Details: ", artistDetails);

              // Extract relevant artist info
              const { id, name, images, genres } = artistDetails.data;
              return { id, name, images, genres };
            })
          );

          // console.log("Artists Info: ", artistsInfo);

          // Extract relevant track information here
          const { id, name } = song.track;

          // Combine artist and track information
          const trackWithArtists = {
            id,
            name,
            artists: artistsInfo,
          };

          return trackWithArtists;
        })
      );

      setSongInfo((prev: any) => ({
        ...prev,
        track: [...prev.track, ...updatedSongInfo],
      }));
    } catch (error) {
      console.log("Error fetching artist info: ", error);
    }
  };

  useEffect(() => {
    console.log("Song Info: ", songInfo);
    // console.log("Match Genre to Song: ", genreToSongMatcher(songInfo));
    console.log(
      "Map to Array Converter: ",
      mapToArrayConverter(genreToSongMatcher(songInfo))
    );
  }, [songInfo]);

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
          <h1 className="playlists-container-title">
            Please Click The Button To Generate Playlists
          </h1>
        </div>

        <div className="generator-btn-container">
          <button className="generator-btn" onClick={handleOnClick}>
            Generate Playlists
          </button>
        </div>
      </div>

      <div className="cards-container">
        {mapToArrayConverter(genreToSongMatcher(songInfo)).map((entry: any) => (
          <Playlists_Card music={entry} key={entry[0]} />
        ))}
      </div>
      {/* {mapToArrayConverter(genreToSongMatcher(songInfo)).map((entry: any) => (
        <div className="card-container" key={entry.key}>
          <Playlists_Card music={entry} />
        </div>
      ))} */}
    </div>
  );
};

export default Playlists;
