// import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import dotenv from "dotenv";

const Homepage = () => {
  dotenv.config();
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
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
    let apiToken: any;
    const getAPIToken = async () => {
      try {
        const body: string = `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`;
        apiToken = await axios.post(
          "https://accounts.spotify.com/api/token",
          body,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      } catch (e: any) {
        console.log(e.error);
      }
    };

    getAPIToken();
    console.log(apiToken);
  }, []);

  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">Playlist Generator</h1>
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
