import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Playlists from "./pages/Playlists";
import GenrePlaylist from "./pages/GenrePlaylist";
import { AccessTokenProvider } from "./contexts/AccessTokenContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { AuthorizationCodeProvider } from "./contexts/AuthorizationCodeContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthorizationCodeProvider>
          <AccessTokenProvider>
            <PlaylistProvider>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/playlists/:codeParam" element={<Playlists />} />
                <Route path="/:genre/playlist" element={<GenrePlaylist />} />
              </Routes>
            </PlaylistProvider>
          </AccessTokenProvider>
        </AuthorizationCodeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
