import { useNavigate } from "react-router-dom";
import { useAuthorizationCode } from "../contexts/AuthorizationCodeContext";
// import crypto from "crypto";
import "../css/homepage.css";

const Homepage = () => {
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const redirectURI: string = "http://localhost:5173/";
  const scope: string =
    "user-read-private user-read-email user-library-read ugc-image-upload user-read-playback-state user-modify-playback-state";
  const authURL: string = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
  const navigate = useNavigate();
  const { authorizationCode, getButtonText } = useAuthorizationCode();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      navigate(authURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = (e: any) => {
    e.preventDefault();
    const buttonText = authorizationCode
      ? "Continue with Spotify Playlists Generator"
      : "Login With Spotify";

    getButtonText(buttonText);
  };

  console.log(authorizationCode);
  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">Spotify Playlists Generator</h1>
      </div>

      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="button-container">
            <button className="btn" onClick={handleButtonClick}>
              {authorizationCode
                ? "Continue with Spotify Playlists Generator"
                : "Login With Spotify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Homepage;
