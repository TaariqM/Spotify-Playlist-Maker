import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAccessToken } from "../contexts/AccessTokenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import Stack from "../data_structures/Stack";
import mapToArrayConverter from "../functions/MapToArrayConverter";
import millisecondsToMinutesAndSeconds from "../functions/MillisecondsToMinutesAndSeconds";
import "../css/genre_playlist.css";
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
  const [deviceID, setDeviceID] = useState<string>();
  // const [play, setPlay] = useState<boolean>(false);
  const [playState, setPlayState] = useState<boolean[]>(
    new Array(tracksInChart.length).fill(false)
  );
  const [trackPositionInMilli, setTrackPositionMilli] = useState<number>(0);
  const myMapRef = useRef(new Map<any, boolean>());
  const myStackRef = useRef(new Stack<string>());

  const addToMap = (key: any, value: boolean) => {
    myMapRef.current.set(key, value);
  };

  const addToStack = (item: string) => {
    myStackRef.current.push(item);
  };

  const retrieveFromMap = (key: any): boolean | undefined => {
    return myMapRef.current.get(key);
  };

  const existsInMap = (key: any): boolean => {
    return myMapRef.current.has(key);
  };

  const retrieveTopOfStack = (): string | undefined => {
    return myStackRef.current.peek();
  };

  const sizeOfStack = (): number => {
    return myStackRef.current.size();
  };

  const popFromStack = (): string | undefined => {
    return myStackRef.current.pop();
  };

  // Sets whether the play or pause button icons will appear or not
  const togglePlayState = (index: number) => {
    let pauseIndex;
    playState.map((state: boolean, i: number) => {
      // if the playState array contains an element that is set to true, change it false
      if (state) {
        playState[i] = !playState[i];
        pauseIndex = i;
      }
    });

    // 2 conditions need to be handled.
    // 1st Condition: User plays a song while all other songs are paused/stopped
    // 2nd Condition: User plays a song while another song is playing
    const newPlayStateArray = [...playState];

    if (pauseIndex != undefined && pauseIndex === index) {
      // this will check if the song that was just playing, has been paused/stopped, by comparing the two indices.
      // If this is true, then there is no need to change the boolean value in the 'playState' array, as it has been taken care of in the above map() function
      setPlayState(newPlayStateArray);
    } else {
      newPlayStateArray[index] = !newPlayStateArray[index];
      setPlayState(newPlayStateArray);
    }
  };

  const play_snippet = (e: any, trackURI: string, index: number) => {
    e.preventDefault();

    if (!existsInMap(trackURI)) {
      // checks if the current track is not in progression (track is being played for the first time)
      addToMap(trackURI, false);
      addToStack(trackURI);
      console.log("Key-Value Pairs in Map: ", myMapRef);
      console.log("Items in Stack: ", myStackRef);
    } else {
      // if the current track has been played before
      console.log("Track URI already exists in Map");
      console.log("Value before being changed: ", retrieveFromMap(trackURI));
      addToMap(trackURI, true);
      console.log("Value after being changed: ", retrieveFromMap(trackURI));
    }
    try {
      console.log("Track URI: ", trackURI);
      console.log("Track URI at the top of the Stack: ", retrieveTopOfStack());
      axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
        {
          uris: [trackURI],
          position_ms:
            trackPositionInMilli > 0 &&
            retrieveFromMap(trackURI) &&
            retrieveTopOfStack() === trackURI
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

      // setPlay(!play);

      togglePlayState(index);

      while (retrieveTopOfStack() != trackURI && sizeOfStack() != 0) {
        popFromStack();
      }

      if (sizeOfStack() === 0) {
        addToStack(trackURI);
      }
    } catch (error) {
      console.log("Error playing track: ", error);
    }
  };

  const pause_snippet = async (e: any, index: number) => {
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

      //setPlay(!play);

      togglePlayState(index);

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

  const getTrackPosition = async () => {
    // let positionInMS = 0;
    try {
      const currentTrackPosition = await axios.get(
        "https://api.spotify.com/v1/me/player",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // positionInMS = currentTrackPosition.data.progress_ms;
      setTrackPositionMilli(currentTrackPosition.data.progress_ms);
    } catch (error) {
      console.log("Error getting current track position");
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
        // console.log("List of Devices for User: ", userDevices.data.devices);
        setDeviceID(userDevices.data.devices[0].id);
      } catch (error) {
        console.error("Error fetching devices: ", error);
      }
    };

    const noDuplicateSongs: any[] = removeDuplicateSongs(songs);
    // console.log("Songs with no Duplicates", noDuplicateSongs);
    getSongData(noDuplicateSongs);
    getDevice();
  }, []);

  // useEffect(() => {
  //   console.log("Tracks that will be in the chart: ", tracksInChart);
  //   console.log("Play value: ", play);
  // }, [tracksInChart, play]);

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
                    <div
                      className="play-button"
                      onClick={
                        !playState[index]
                          ? (e) => play_snippet(e, track.trackURI, index)
                          : (e) => pause_snippet(e, index)
                      }
                    >
                      {!playState[index] ? (
                        <FontAwesomeIcon
                          className="play-button-icon"
                          icon={faPlay}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="pause-button-icon"
                          icon={faPause}
                        />
                      )}
                    </div>

                    <div className="track-number">
                      <div className="genre-playlist-text">
                        {!playState[index] ? (
                          index + 1
                        ) : (
                          <FontAwesomeIcon
                            className="pause-button-icon"
                            icon={faPause}
                          />
                        )}
                      </div>
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
