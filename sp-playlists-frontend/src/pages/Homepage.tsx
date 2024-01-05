import { useState, useEffect } from "react";
import axios from "axios";
import "../css/homepage.css";

const Homepage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [spotifyUserID, setSpotifyUserID] = useState("");
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;

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
      console.log(values);
    } catch (e: any) {
      console.log(e.error);
    }
  };

  useEffect(() => {
    // API Access Token
    const getAPIToken = async () => {
      try {
        const body: any = `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`;
        await axios
          .post("https://accounts.spotify.com/api/token", body, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((response) => {
            setAccessToken(response.data.access_token);
          });
      } catch (e: any) {
        console.log(e.error);
      }
    };

    getAPIToken();
  }, []);

  // console.log(accessToken);
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
          <div className="label-input">
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
          </div>

          <div className="button-container">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Homepage;
