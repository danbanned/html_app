import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ImagineDesign from "./pages/ImagineDesign.jsx";
import StoryBoard from "./pages/StoryBoard.jsx";

export default function MainPage() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">StoryBoard</Link> |{" "}
        <Link to="/imagedesign">ImagineDesign</Link>
      </nav>

      <Routes>
        <Route path="/" element={<StoryBoard />} />
        <Route path="/imagedesign" element={<ImagineDesign />} />
      </Routes>
    </BrowserRouter>
  );
}


