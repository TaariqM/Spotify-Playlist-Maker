import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const GenrePlaylist = () => {
  const location = useLocation();
  const { genre, songs, image, coverArtist } = location.state;
  console.log("Name of Genre", genre);
  console.log("Songs in the genre: ", songs);
  console.log("Playlist Image: ", image);
  console.log("Cover Artist: ", coverArtist);

  const getSongData = async (song: any) => {
    const songData = await axios.get(
      `https://api.spotify.com/v1/tracks/${song.songDataInfo.songID}`
    );
  };
  return (
    <div className="genre-playlist-container">
      <div className="genre-playlist-container-img-title-container">
        <div className="genre-playlist-container-img-title-container-img">
          <img className="genre-playlist-img" src={image} />
        </div>

        <div className="genre-playlist-container-img-title-container-title">
          <h1 className="genre-playlist-title">{genre}</h1>
        </div>
      </div>

      <div className="genre-playlist-container-songs-container">
        <table>
          <thead>
            <tr>
              <th>
                <div>Album Cover</div>
              </th>
              <th>
                <div>Name</div>
              </th>
              <th>
                <div>Artists</div>
              </th>
              <th>
                <div>Album</div>
              </th>
              <th>
                <div>Duration</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song: any) => (
              <tr key={song.songDataInfo.songID}>
                <td>{song.songDataInfo.songName}</td>
                <td>Artist</td>
                <td>Album</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenrePlaylist;
