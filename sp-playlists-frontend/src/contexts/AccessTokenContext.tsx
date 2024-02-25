import { createContext, useContext, useState, useEffect } from "react";
import { useAuthorizationCode } from "./AuthorizationCodeContext";
import axios from "axios";

interface AccessTokenContextProps {
  accessToken: string | null;
}

const AccessTokenContext = createContext<AccessTokenContextProps>({
  accessToken: null,
});

export const AccessTokenProvider = ({ children }: { children: any }) => {
  const redirectURI: string = "https://playlists-generator.web.app/";
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { authorizationCode } = useAuthorizationCode();

  useEffect(() => {
    // API Access Token
    const getAccessToken = async () => {
      try {
        if (!authorizationCode) {
          console.error("Authentication code is missing");
          return;
        }
        const formData = new URLSearchParams({
          code: authorizationCode || "",
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
  }, [authorizationCode]);

  return (
    <AccessTokenContext.Provider value={{ accessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};
