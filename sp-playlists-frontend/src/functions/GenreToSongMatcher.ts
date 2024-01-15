// type SongInfoState = {
//   track: { id: string; name: string }[];
//   artists: { id: string; name: string; images: any[]; genres: string[] }[];
// };
// import { useState } from "react";

function genreToSongMatcher(songInfo: any): any {
  // let genreContainer = {
  //   genreName: "",
  //   songID: "",
  //   artistID: "",
  // };
  // const [genreContainer, setGenreContainer] = useState({
  //   genres: []
  // });

  let genreDict: { [key: string]: any[] } = {};

  songInfo.map((song: any) => {
    // let track: any = song.track;
    song.artists.map((artist: any) => {
      artist.genres.map((genre: string) => {
        const songData = {
          songID: song.id,
          songName: song.name,
        };

        const artistData = {
          artistID: artist.id,
          artistName: artist.name,
          artistIMG: artist.images[0],
        };

        const trackData = {
          songDataInfo: songData,
          artistDataInfo: artistData,
        };

        if (genreDict[genre] === null) {
          let array: any[] = [];
          array.push(trackData);
          genreDict[genre] = array;
        } else {
          genreDict[genre].push(trackData);
        }
      });
    });
  });
  return genreDict;
}

export default genreToSongMatcher;
