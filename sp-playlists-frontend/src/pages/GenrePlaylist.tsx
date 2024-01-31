import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAccessToken } from "../contexts/AccessTokenContext";
import mapToArrayConverter from "../functions/MapToArrayConverter";
import millisecondsToMinutesAndSeconds from "../functions/MillisecondsToMinutesAndSeconds";
import axios from "axios";

const GenrePlaylist = () => {
  const location = useLocation();
  const { genre, songs, image, coverArtist } = location.state;
  // console.log("Name of Genre", genre);
  // console.log("Songs in the genre: ", songs);
  // console.log("Playlist Image: ", image);
  // console.log("Cover Artist: ", coverArtist);

  const { accessToken } = useAccessToken();
  const [tracksInChart, setTracksInChart] = useState<any[]>([]);

  // console.log("Access Token in GenrePlaylist Component: ", accessToken);

  useEffect(() => {
    const removeDuplicateSongs = (allSongs: any): any => {
      const noDuplicates = new Map<string, any>();
      // const noDuplicates: any[] = [];
      allSongs.map((song: any) => {
        // if (!noDuplicates.includes(song)) {
        //   noDuplicates.push(song);
        // }

        if (!noDuplicates.has(song.songDataInfo.songName)) {
          noDuplicates.set(song.songDataInfo.songName, song);
        }
      });

      return noDuplicates;
    };

    const getSongData = async (allSongs: any[]) => {
      const allSongsInfo = await Promise.all(
        allSongs.map(async (song: any) => {
          const trackName: string = song[0];
          const songData = await axios.get(
            `https://api.spotify.com/v1/tracks/${song[1].songDataInfo.songID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // console.log("Song Data: ", songData.data);
          const { album, artists, duration_ms } = songData.data;
          const trackInfo = {
            trackName: trackName,
            album: album,
            artists: artists,
            duration: duration_ms,
          };

          setTracksInChart((prev: any[]) => [...prev, trackInfo]);

          // return { trackName, album, artists, duration_ms };
        })
      );

      // setTracksInChart(allSongsInfo);

      // console.log("All Songs Info: ", allSongsInfo);
    };

    const noDuplicateSongs: any[] = mapToArrayConverter(
      removeDuplicateSongs(songs)
    );
    // console.log("Songs with no Duplicates", noDuplicateSongs);
    getSongData(noDuplicateSongs);
  }, []);

  // useEffect(() => {
  //   console.log("Tracks that will be in the chart: ", tracksInChart);
  // }, [tracksInChart]);

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

      <div>
        <h2>Cover Artist: {coverArtist}</h2>
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
            {tracksInChart.map((track: any, index: number) => (
              <tr key={index}>
                <td>
                  <img src={track.album.images[2].url} />
                </td>
                <td>{track.trackName}</td>
                <td>
                  {track.artists.map((artist: any) => {
                    artist.name;
                  })}
                </td>
                <td>{track.album.name}</td>
                <td>{millisecondsToMinutesAndSeconds(track.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenrePlaylist;
