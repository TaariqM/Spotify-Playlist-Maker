import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface AuthorizationCodeContextProps {
  authorizationCode: string | null | undefined;
  getButtonText: (text: string) => void;
}

const AuthorizationCodeContext = createContext<AuthorizationCodeContextProps>({
  authorizationCode: null,
  getButtonText: () => {},
});

export const AuthorizationCodeProvider = ({ children }: { children: any }) => {
  const [codeParams] = useSearchParams();
  const clientID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const redirectURI: string = "http://localhost:5173/";
  const scope: string =
    "user-read-private user-read-email user-library-read ugc-image-upload user-read-playback-state user-modify-playback-state";
  const authURL: string = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
  const navigate = useNavigate();

  const [authorizationCode, setAuthorizationCode] = useState<string | null>(
    () => {
      return (
        codeParams.get("code") || localStorage.getItem("authorizationCode")
      );
    }
  );

  const getButtonText = (text: string) => {
    if (text === "Login With Spotify") {
      window.location.href = authURL;
    } else {
      navigate(`/playlists/${authorizationCode}`);
    }
  };

  useEffect(() => {
    setAuthorizationCode(codeParams.get("code"));
    localStorage.setItem("authorizationCode", codeParams.get("code") || "");
  }, [codeParams]);

  return (
    <AuthorizationCodeContext.Provider
      value={{ authorizationCode, getButtonText }}
    >
      {children}
    </AuthorizationCodeContext.Provider>
  );
};

export const useAuthorizationCode = () => {
  return useContext(AuthorizationCodeContext);
};
