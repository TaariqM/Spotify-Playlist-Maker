import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
// import crypto from "crypto";
import "../css/homepage.css";

const Homepage = () => {
  const [spotifyUserID, setSpotifyUserID] = useState("");
  const [codeParams, setCodeParams] = useSearchParams();
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;
  const redirectURI: string = "http://localhost:5173/";
  const scope: string = "user-read-private user-read-email";
  const authURL: string = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: any) => {
    e.preventDefault();
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // console.log(values);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      // console.log(values);
      navigate(authURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = (e: any) => {
    e.preventDefault();
    const buttonText = code
      ? "Continue with Spotify Playlists Generator"
      : "Login With Spotify";
    if (buttonText === "Login With Spotify") {
      window.location.href = authURL;
    } else {
      //Navigate to Playlists page
      navigate(`/playlists/${code}`);
    }
  };

  const code = codeParams.get("code");
  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">Spotify Playlists Generator</h1>
        <h2 className="sub-title">
          Please Enter Your Spotify Username and Password
        </h2>
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
              {code
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
