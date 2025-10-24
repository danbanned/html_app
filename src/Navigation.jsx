import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ImagineDesign from "./pages/ImagineDesign.jsx";
import "./styles/Navigation.css";
import StoryBoard from "./pages/MainPage.jsx";
import StoryboardPage from './pages/StoryboardPage.jsx'
import CategoryPage from "./storyboard-component/CategoryPage.jsx";


export default function MainPage() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="nav-logo">VI Story</div>
        </div>

        {/* Scrollable links for small screens (same links duplicated) */}
        <div className="nav-links-scroll" aria-hidden="true">
          <Link to="/" className="nav-link">StoryBoard</Link>
          <Link to="/imagedesign" className="nav-link">Imagine Design</Link>
          <Link to="/storyboardpage" className="nav-link">Storyboard Page</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<StoryBoard />} />
        <Route path="/imagedesign" element={<ImagineDesign />} />
        <Route path="/storyboardpage" element={<StoryboardPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>

  );
}


