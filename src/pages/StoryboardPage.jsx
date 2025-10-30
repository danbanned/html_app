import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StoryboardPage.css";


export default function StoryboardPage() {
  const [section, setSection] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { name: "Theme", key: "theme", icon: "🎨", desc: "Create your story’s main theme" },
    { name: "Characters", key: "characters", icon: "🧍", desc: "Add and design your characters" },
    { name: "Scene", key: "scene", icon: "🎬", desc: "Build your story’s key scenes" },
    { name: "Setting", key: "setting", icon: "🌄", desc: "Describe your story’s world or location" },
  ];


  

  const renderSection = () => {
    switch (section) {
      case "theme":
        return <div className="section">🎨 Create your story’s main theme here.</div>;
      case "characters":
        return <div className="section">🧍 Add and design your characters.</div>;
      case "scene":
        return <div className="section">🎬 Build your story’s scenes here.</div>;
      case "setting":
        return <div className="section">🌄 Describe or draw your story’s setting.</div>;
      default:
        return (
          <div className="storyboard-boxes">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="storyboard-box"
                onClick={() => navigate(`/category/${cat.key}`)}
              >
                <h2>{cat.icon} {cat.name}</h2>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  useEffect(() => {
  const container = document.querySelector(".storyboard-grid");
  if (!container) return;

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const offsetX = (e.clientX / innerWidth - 0.5) * 20; // subtle horizontal tilt
    const offsetY = (e.clientY / innerHeight - 0.5) * 20; // subtle vertical tilt

    container.querySelectorAll(".storyboard-box").forEach((box, index) => {
      const rotationX = offsetY * 0.5 + (index % 5) * 0.2;
      const rotationY = -offsetX * 0.5 - (index % 5) * 0.2;
      box.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

  return (
    <div className="storyboard-container">
      <h1>Storyboard Creator</h1>

      {section ? (
        <nav className="storyboard-nav">
          <button onClick={() => setSection(null)}>Back</button>
          <button onClick={() => navigate("/")}>Home</button>
        </nav>
      ) : (
        <p className="intro-text">Select a category to start building your story</p>
      )}

      <div className="storyboard-content">{renderSection()}</div>'

    
      
      

      
      {/* Floating AI panel */}
    </div>
  );
}
