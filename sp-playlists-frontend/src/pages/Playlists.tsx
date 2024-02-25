import { usePlaylists } from "../contexts/PlaylistContext";
import { useAccessToken } from "../contexts/AccessTokenContext";
import genreToSongMatcher from "../functions/GenreToSongMatcher";
import mapToArrayConverter from "../functions/MapToArrayConverter";
import Playlists_Card from "../components/Playlists_Card";
import "../css/playlists.css";

const Playlists = () => {
  const { accessToken } = useAccessToken();
  const { songInfo, getToken } = usePlaylists();

  const handleOnClick = async (e: any) => {
    e.preventDefault();
    getToken(accessToken);
  };

  return (
    <div className="playlists">
      <div className="container">
        <div className="empty-playlists-container">
          <h1 className="playlists-container-title">Generate Playlists</h1>
        </div>

        <div className="generator-btn-container">
          <button className="generator-btn" onClick={handleOnClick}>
            Generate Playlists
          </button>
        </div>
      </div>

      <div className="cards-container">
        {mapToArrayConverter(genreToSongMatcher(songInfo)).map((entry: any) => (
          <Playlists_Card music={entry} key={entry[0]} />
        ))}
      </div>
    </div>
  );
};

export default Playlists;
