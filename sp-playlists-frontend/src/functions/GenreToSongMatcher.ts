function genreToSongMatcher(songInfo: any): any {
  const genreDict = new Map<string, any[]>();

  songInfo.track.map((song: any) => {
    song.artists.map((artist: any) => {
      artist.genres.map((genre: string) => {
        const songData = {
          songID: song.id,
          songName: song.name,
          songURI: song.uri,
        };
        let imageArray: any[] = [];
        imageArray.push(artist.images[1]);
        imageArray.push(artist.images[2]);
        const artistData = {
          artistID: artist.id,
          artistName: artist.name,
          artistIMG: imageArray,
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
