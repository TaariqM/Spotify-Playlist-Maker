import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AccessTokenContextProps {
  // children: ReactNode;
  accessToken: string | null;
  authorizationCode: string | null;
  setCode: (code: string | null) => void; // function to set the authorization code from the Homepage file
}

const AccessTokenContext = createContext<AccessTokenContextProps>({
  accessToken: null,
  authorizationCode: null,
  setCode: () => {},
});

export const AccessTokenProvider = ({ children }: { children: any }) => {
  const redirectURI: string = "http://localhost:5173/";
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authorizationCode, setAuthorizationCode] = useState<string | null>(
    null
  );

  // setAuthorizationCode(codeParam.get("code"));

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

  const setCode = (code: string | null) => {
    setAuthorizationCode(code);
  };

  return (
    <AccessTokenContext.Provider
      value={{ accessToken, authorizationCode, setCode }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};
