import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles/CategoryPage.css";

const NUM_LEAVES = 25; // more leaves for forest effect

export default function FloatingForest() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate random leaves
    const generated = Array.from({ length: NUM_LEAVES }).map(() => ({
      size: Math.random() * 40 + 20, // 20px to 60px
      top: Math.random() * 100, // percentage
      left: Math.random() * 100,
      speed: Math.random() * 10 + 5, // seconds
      rotation: Math.random() * 360,
    }));
    setLeaves(generated);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return ReactDOM.createPortal(
    <div className="floating-forest">
      {leaves.map((leaf, idx) => {
        const offsetX = (mousePos.x / window.innerWidth - 0.5) * 50; // move with mouse
        const offsetY = (mousePos.y / window.innerHeight - 0.5) * 50;
        return (
          <div
            key={idx}
            className="floating-leaf"
            style={{
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              top: `${leaf.top}%`,
              left: `${leaf.left}%`,
              animationDuration: `${leaf.speed}s, ${leaf.speed * 1.5}s`,
              transform: `translate3d(${offsetX}px, ${offsetY}px, 0) rotateZ(${leaf.rotation}deg)`,
            }}
          />
        );
      })}
    </div>,
    document.body // <-- target body
  );
}
