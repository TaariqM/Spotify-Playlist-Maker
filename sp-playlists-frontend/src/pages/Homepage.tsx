import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccessToken } from "../contexts/AccessTokenContext";
import { useAuthorizationCode } from "../contexts/AuthorizationCodeContext";
// import crypto from "crypto";
import "../css/homepage.css";

const Homepage = () => {
  const [codeParams, setCodeParams] = useSearchParams();
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const redirectURI: string = "http://localhost:5173/";
  const scope: string =
    "user-read-private user-read-email user-library-read ugc-image-upload user-read-playback-state user-modify-playback-state";
  const authURL: string = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
  const navigate = useNavigate();
  const { authorizationCode, getButtonText } = useAuthorizationCode();
  // const { setCode } = useAccessToken();

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
    // if (buttonText === "Login With Spotify") {
    //   // window.location.href = authURL;
    //   getButtonText();
    // } else {
    //   navigate(`/playlists/${authorizationCode}`);
    // }
  };

  // const authorizationCode = codeParams.get("code");

  // getAuthorizationCode(codeParams.get("code"));

  // useEffect(() => {
  //   if (authorizationCode) {
  //     setCode(authorizationCode);
  //   }
  // }, [authorizationCode, setCode]);

  console.log(authorizationCode);
  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">Spotify Playlists Generator</h1>
        {/*<h2 className="sub-title">
          Please Enter Your Spotify Username and Password
  </h2> */}
      </div>

      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          {/*<div className="label-input">
            <label>Username</label>
            <div className="input-container">
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
            </div>

            <label>Password</label>
            <div className="input-container">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
  </div>*/}

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
