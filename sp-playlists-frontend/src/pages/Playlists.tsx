// import React from 'react'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Playlists = () => {
  const { codeParam } = useParams();
  const [accessToken, setAccessToken] = useState("");
  const redirectURI: string = "http://localhost:5173/";
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;

  // console.log(codeParam);
  useEffect(() => {
    // API Access Token
    const getAccessToken = async () => {
      try {
        if (!codeParam) {
          console.error("Authentication code is missing");
          return;
        }
        const formData = new URLSearchParams({
          code: codeParam || "",
          redirect_uri: redirectURI,
          grant_type: "authorization_code",
        });

        const authHeader = `Basic ${btoa(`${clientID}:${clientSecret}`)}`;
        await axios
          .post("https://accounts.spotify.com/api/token", formData.toString(), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: authHeader,
            },
          })
          .then((response) => {
            setAccessToken(response.data.access_token);
          });
      } catch (e: any) {
        console.log(e.error);
      }
    };

    getAccessToken();
  }, []);

  console.log(accessToken);

  return <div>Playlists</div>;
};

export default Playlists;
