import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Playlists from "./pages/Playlists";
import GenrePlaylist from "./pages/GenrePlaylist";
import { AccessTokenProvider } from "./contexts/AccessTokenContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AccessTokenProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/playlists/:codeParam" element={<Playlists />} />
            <Route path="/:genre/playlist" element={<GenrePlaylist />} />
          </Routes>
        </AccessTokenProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
