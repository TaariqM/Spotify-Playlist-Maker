function genreToSongMatcher(songInfo: any): any {
  const genreDict = new Map<string, any[]>();

  songInfo.track.map((song: any) => {
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

        if (genreDict.get(genre) == null) {
          let array: any[] = [];
          array.push(trackData);
          genreDict.set(genre, array);
        } else {
          genreDict.get(genre)?.push(trackData);
        }
      });
    });
  });
  return genreDict;
}

export default genreToSongMatcher;
