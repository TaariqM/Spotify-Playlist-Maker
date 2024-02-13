import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAccessToken } from "../contexts/AccessTokenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import mapToArrayConverter from "../functions/MapToArrayConverter";
import millisecondsToMinutesAndSeconds from "../functions/MillisecondsToMinutesAndSeconds";
import "../css/genre_playlist.css";
import axios from "axios";

const GenrePlaylist = () => {
  const location = useLocation();
  const { genre, songs, image, coverArtist } = location.state;

  // console.log("Name of Genre", genre);
  console.log("Songs in the genre: ", songs);
  // console.log("Playlist Image: ", image);
  // console.log("Cover Artist: ", coverArtist);

  const { accessToken } = useAccessToken();
  const [tracksInChart, setTracksInChart] = useState<any[]>([]);
  const [deviceID, setDeviceID] = useState<string>();
  const [play, setPlay] = useState<boolean>(false);
  const [trackPositionInMilli, setTrackPositionMilli] = useState<number>(0);
  const progressedTracks = new Map<any, boolean>();
  // const trackStack = new Stack<string>();

  const play_snippet = async (e: any, trackURI: string) => {
    e.preventDefault();
    // e.stopPropagation();
    // console.log("Play Snippet function");
    if (!progressedTracks.has(trackURI)) {
      // checks if the current track is not in progression (track is being played for the first time)
      progressedTracks.set(trackURI, true);
      // add this track to the top of the stack as well
    }
    // else {
    //   progressedTracks.set(trackURI, true); // checks if the current track is in progression (if the track was paused, and is now being resumed)
    // }
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
        {
          uris: [trackURI],
          // offset: { uri: trackURI },
          position_ms:
            trackPositionInMilli > 0 && progressedTracks.get(trackURI)
              ? trackPositionInMilli
              : 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setPlay(!play);
    } catch (error) {
      console.log("Error playing track: ", error);
    }
  };

  const pause_snippet = async (e: any) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setPlay(!play);

      const currentTrackPosition = await axios.get(
        "https://api.spotify.com/v1/me/player",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(currentTrackPosition);
      setTrackPositionMilli(currentTrackPosition.data.progress_ms);
    } catch (error) {
      console.log("Error pausing played track: ", error);
    }
  };

  const getArtistNames = (artists: any[]): string => {
    let artistsNames = "";

    if (artists.length > 1) {
      for (let artist of artists) {
        artistsNames = artistsNames + artist.name + ", ";
      }

      artistsNames = artistsNames.substring(0, artistsNames.length - 2);
    } else {
      artistsNames = artists[0].name;
    }

    return artistsNames;
  };

  useEffect(() => {
    const removeDuplicateSongs = (allSongs: any): any[] => {
      const noDuplicates = new Map<string, any>();
      allSongs.map((song: any) => {
        if (!noDuplicates.has(song.songDataInfo.songName)) {
          noDuplicates.set(song.songDataInfo.songName, song);
        }
      });

      return mapToArrayConverter(noDuplicates);
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
          const { album, artists, duration_ms } = songData.data;
          const trackInfo = {
            trackName: trackName,
            album: album,
            artists: artists,
            duration: duration_ms,
            trackURI: song[1].songDataInfo.songURI,
          };
          return trackInfo;
        })
      );

      setTracksInChart([...allSongsInfo]);
    };

    const getDevice = async () => {
      try {
        const userDevices = await axios.get(
          "https://api.spotify.com/v1/me/player/devices",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("List of Devices for User: ", userDevices.data.devices);
        setDeviceID(userDevices.data.devices[0].id);
      } catch (error) {
        console.error("Error fetching devices: ", error);
      }
    };

    const noDuplicateSongs: any[] = removeDuplicateSongs(songs);
    console.log("Songs with no Duplicates", noDuplicateSongs);
    getSongData(noDuplicateSongs);
    getDevice();
  }, []);

  useEffect(() => {
    console.log("Tracks that will be in the chart: ", tracksInChart);
    console.log("Play value: ", play);
  }, [tracksInChart, play]);

  return (
    <div className="genre-playlist-container">
      <div className="genre-playlist-container-img-title-container">
        <div className="genre-playlist-container-img-title-container-img">
          <img className="genre-playlist-img" src={image} />
        </div>

        <div className="genre-playlist-container-img-title-container-title">
          <h1 className="genre-playlist-text">{genre}</h1>
        </div>
      </div>

      <div className="genre-playlist-container-cover-artist-name">
        <h2 className="genre-playlist-text">Cover Artist: {coverArtist}</h2>
      </div>

      <div className="genre-playlist-container-songs-container">
        <table>
          <thead>
            <tr>
              <th>
                <div className="genre-playlist-text">#</div>
              </th>
              <th>
                <div className="genre-playlist-text">Album Cover</div>
              </th>
              <th>
                <div className="genre-playlist-text">Name</div>
              </th>
              <th>
                <div className="genre-playlist-text">Artists</div>
              </th>
              <th>
                <div className="genre-playlist-text">Album</div>
              </th>
              <th>
                <div className="genre-playlist-text">Duration</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tracksInChart.map((track: any, index: number) => (
              <tr className="genre-playlist-row" key={index}>
                <td>
                  <div className="track-number-play-button-container">
                    {!play ? (
                      <div
                        className="play-button"
                        onClick={(e) => play_snippet(e, track.trackURI)}
                      >
                        <FontAwesomeIcon
                          className="play-button-icon"
                          icon={faPlay}
                        />
                      </div>
                    ) : (
                      <div
                        className="play-button"
                        onClick={(e) => pause_snippet(e)}
                      >
                        <FontAwesomeIcon
                          className="pause-button-icon"
                          icon={faPause}
                        />
                      </div>
                    )}

                    <div className="track-number">
                      <div className="genre-playlist-text">{index + 1}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="album-image-container">
                    <img
                      className="album-image"
                      src={track.album.images[2].url}
                    />
                  </div>
                </td>
                <td className="genre-playlist-text">{track.trackName}</td>
                <td className="genre-playlist-text">
                  {getArtistNames(track.artists)}
                </td>
                <td className="genre-playlist-text">{track.album.name}</td>
                <td className="genre-playlist-text">
                  {millisecondsToMinutesAndSeconds(track.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenrePlaylist;
