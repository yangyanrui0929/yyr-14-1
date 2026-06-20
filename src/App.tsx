import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Game } from "@/pages/Game";
import { Editor } from "@/pages/Editor";
import { Replay } from "@/pages/Replay";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:levelId" element={<Game />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/replay/:replayId" element={<Replay />} />
      </Routes>
    </Router>
  );
}
