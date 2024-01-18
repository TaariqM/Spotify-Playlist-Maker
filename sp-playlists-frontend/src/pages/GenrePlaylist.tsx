import { useLocation } from "react-router-dom";

const GenrePlaylist = () => {
  const location = useLocation();
  const { genre, songs, image, coverArtist } = location.state;
  console.log("Name of Genre", genre);
  console.log("Songs in the genre: ", songs);
  console.log("Playlist Image: ", image);
  console.log("Cover Artist: ", coverArtist);
  return <div>GenrePlaylist</div>;
};

export default GenrePlaylist;
