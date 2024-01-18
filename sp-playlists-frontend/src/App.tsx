import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Playlists from "./pages/Playlists";
import GenrePlaylist from "./pages/GenrePlaylist";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/playlists/:codeParam" element={<Playlists />} />
          <Route path="/:genre/playlist" element={<GenrePlaylist />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
