type SongInfoState = {
  track: { id: string; name: string }[];
  artists: { id: string; name: string; images: any[]; genres: string[] }[];
};

function genreToSongMatcher(songInfo: any): any {
  let genreContainer = {
    genreName: "",
    songID: "",
    artistID: "",
  };

  //   songInfo.map((song: any) => {
  //       let track: any = song.track;
  //       song.artists.map((artist: any) => {
  //           artist.genres.map((genre: string) => {
  //               let artistId = artist.id;
  //               if (track)
  //           })
  //       })
  //   })
  return genreContainer;
}

export default genreToSongMatcher;
