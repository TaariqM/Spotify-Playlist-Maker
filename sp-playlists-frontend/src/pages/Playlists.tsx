// import React from 'react'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import genreToSongMatcher from "../functions/GenreToSongMatcher";

const Playlists = () => {
  // type SongInfoState = {
  //   track: { songID: string; songName: string; artistIDs: string[] }[];
  //   // artists: { id: string; name: string; images: any[]; genres: string[] }[];
  // };
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

    // getAllGenres(userSavedSongs);
    // getAllGenres(savedSongs?.data.items);
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

          // setSongInfo((prev) => ({
          //   ...prev,
          //   track: [
          //     ...prev.track,
          //     {
          //       id,
          //       name,
          //       artistIDs: artistsIds,
          //     },
          //   ],
          //   artists: [
          //     ...prev.artists,
          //     ...(artistsInfo as {
          //       id: string;
          //       name: string;
          //       images: any[];
          //       genres: string[];
          //     }[]),
          //   ],
          // }));

          // return null;

          // return {
          //   track: {
          //     id,
          //     name,
          //     artistIDs: artistsIds,
          //   },
          //   artists: artistsInfo,
          // };
        })
      );

      setSongInfo((prev: any) => ({
        ...prev,
        track: [...prev.track, ...updatedSongInfo],
      }));

      // console.log("Updated Song Info", updatedSongInfo);

      // setSongInfo((prev) => ({
      //   ...prev,
      //   track: [
      //     ...prev.track,
      //     ...updatedSongInfo.map((item: any) => item.track),
      //   ],
      //   artists: [
      //     ...prev.artists,
      //     ...updatedSongInfo.map((item: any) => item.artists),
      //   ],
      // }));
    } catch (error) {
      console.log("Error fetching artist info: ", error);
    }
  };

  useEffect(() => {
    console.log("Song Info: ", songInfo);
    // console.log("Match Genre to Song: ", genreToSongMatcher(songInfo));
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
