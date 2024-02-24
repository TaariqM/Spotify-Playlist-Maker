import { createContext, useContext, useState, useEffect } from "react";
// import { useAccessToken } from "./AccessTokenContext";
import axios from "axios";

interface PlaylistContextProps {
  songInfo: { track: any[] };
  getToken: (accessToken: string | null) => void;
  // getSavedSongs: (accessToken: any) => void;
}

const PlaylistContext = createContext<PlaylistContextProps>({
  songInfo: { track: [] },
  getToken: () => {},
});

export const PlaylistProvider = ({ children }: { children: any }) => {
  const [songInfo, setSongInfo] = useState({
    track: [],
  });

  // const { accessToken } = useAccessToken();
  const [token, setToken] = useState<string | null>();

  const getToken = (accessToken: string | null) => {
    setToken(accessToken);
  };

  // const getSavedSongs = async (accessToken: any) => {
  //   let savedSongs;
  //   try {
  //     savedSongs = await axios.get(
  //       "https://api.spotify.com/v1/me/tracks?limit=50",
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     console.log("All User Saved Songs: ", savedSongs.data.items);
  //     // setUserSavedSongs(savedSongs.data.items);
  //     getAllArtists(savedSongs.data.items, accessToken);
  //   } catch (error) {
  //     console.log("Error fetching saved songs: ", error);
  //   }
  // };

  useEffect(() => {
    let savedSongs;
    // console.log("Test");

    const getSavedSongs = async () => {
      try {
        savedSongs = await axios.get(
          "https://api.spotify.com/v1/me/tracks?limit=50",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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

    getSavedSongs();
  }, [token]);

  const getAllArtists = async (songs: any) => {
    try {
      // console.log("User Saved Songs From getAllArtists() Function: ", songs);
      const updatedTrackInfo = await Promise.all(
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
                    Authorization: `Bearer ${token}`,
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
          const { id, name, uri } = song.track;

          // Combine artist and track information
          const trackWithArtists = {
            id,
            name,
            uri,
            artists: artistsInfo,
          };

          return trackWithArtists;
        })
      );

      console.log("Setting songInfo array");
      setSongInfo((prev: any) => ({
        ...prev,
        track: [...prev.track, ...updatedTrackInfo],
      }));
    } catch (error) {
      console.log("Error fetching artist info: ", error);
    }
  };

  return (
    <PlaylistContext.Provider value={{ songInfo, getToken }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  return useContext(PlaylistContext);
};
