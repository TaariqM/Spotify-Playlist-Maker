import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Playlists from "./pages/Playlists";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
