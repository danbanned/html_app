// src/pages/CategoryPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CategoryPage.css"
import { useCategory } from "../components/CategoryContext.jsx";
import CategoryPanelBase from "./CategoryPanelBase.jsx"; // ✅ Unified Add/Edit panel
import FloatingForest from "./FloatingForest";


export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { categories, addSlide, deleteSlide } = useCategory();

  // ✅ Ensure category exists
  const currentSlides = categories[category] || [
    { id: "placeholder-1", title: `Add new ${category}`, placeholder: true },
  ];

  const [slides, setSlides] = useState(currentSlides);
  const [editingSlide, setEditingSlide] = useState(null);
  const [addingSlide, setAddingSlide] = useState(false);
  
  
  //-======================================================'
  //-======================================================'


  // 🧭 Scroll logic refs
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const scrollSpeedRef = useRef(0.6);
  const userInteractingRef = useRef(false);

  const duplicatedSlides = [...slides, ...slides];

  // 🌀 Auto-scroll
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let lastTimestamp = null;

    function step(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!userInteractingRef.current) {
        container.scrollLeft += (scrollSpeedRef.current * dt) / (1000 / 60);
      }

      const totalWidth = track.scrollWidth / 2;
      if (container.scrollLeft >= totalWidth) container.scrollLeft -= totalWidth;

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [slides]);

  // 🎮 Pause auto-scroll on user interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stopScroll = () => (userInteractingRef.current = true);
    const resumeScroll = () => (userInteractingRef.current = false);

    const onWheel = () => {
      stopScroll();
      clearTimeout(container._wheelTimeout);
      container._wheelTimeout = setTimeout(resumeScroll, 800);
    };

    container.addEventListener("pointermove", stopScroll);
    container.addEventListener("pointerdown", stopScroll);
    container.addEventListener("pointerleave", resumeScroll);
    container.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      container.removeEventListener("pointermove", stopScroll);
      container.removeEventListener("pointerdown", stopScroll);
      container.removeEventListener("pointerleave", resumeScroll);
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  // 🛠️ Edit Slide
  const handleEditSlide = (updatedSlide) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? { ...s, ...updatedSlide } : s))
    );
    addSlide(category, updatedSlide);
    setEditingSlide(null);
  };

  // ➕ Add Slide
  const handleAddSlideFromPanel = (newSlide) => {
    const fullSlide = {
      ...newSlide,
      id: Date.now().toString(),
      placeholder: false,
    };
    setSlides((prev) => [...prev, fullSlide]);
    addSlide(category, fullSlide);
    setAddingSlide(false);
  };

  // 🗑️ Delete Slide
  const handleDeleteSlide = (id) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    deleteSlide(category, id);
  };

  const handlePlaceholderClick = () => setAddingSlide(true);

  // 🧱 Slide UI
  const slideElements = duplicatedSlides.map((slide, idx) => (
    <div
      key={`${slide.id}-${idx}`}
      className={`slide ${slide.placeholder ? "placeholder" : ""}`}
      onClick={slide.placeholder ? handlePlaceholderClick : undefined}
    >
      {slide.imageUrl ? (
        <div
          className="cover"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
      ) : (
        <div className="cover color-cover">
          {!slide.placeholder && slide.title?.[0]}
        </div>
      )}

      <div className="meta">
        <h3>{slide.title}</h3>
        {slide.description && <p className="desc">{slide.description}</p>}

        {!slide.placeholder && (
          <div className="button-row">
            <button
              className="Edit"
              onClick={(e) => {
                e.stopPropagation();
                setEditingSlide(slide);
              }}
            >
              Edit
            </button>
            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSlide(slide.id);
              }}
            >
              Delete
            </button>
          </div>
        )}

        {slide.placeholder && (
          <div className="placeholder-label">Click to add {category}</div>
        )}
      </div>
    </div>
  ));

  // 🌐 Header
  const header = (
    <header className="category-header">
      <button className="back-btn" onClick={() => navigate("/storyboardpage")}>
        ← Back
      </button>
      <h2>{category?.toUpperCase()}</h2>
      <button className="add-btn" onClick={() => setAddingSlide(true)}>
        + Add New
      </button>
    </header>
  );

  // 🎞️ Slide Container
  const slidesContainer = (
    <div
      className="slides-viewport"
      ref={containerRef}
      tabIndex={0}
      aria-label={`${category} slides`}
    >
      <div className="slides-track" ref={trackRef}>
        {slideElements}
      </div>
    </div>
  );

  // 🏗️ Layout
  return (
        <>

    
    <div className="category-layout">
     
      
      {/* 🌙 Sidebar */}
      <aside className="category-sidebar"
      
      
      >
        <h3>{category?.toUpperCase()}</h3>
        <p>{slides.length} slides</p>

        

        <button onClick={() => navigate("/storyboardpage")}>← Back</button>
        <button onClick={() => setAddingSlide(true)}>+ Add Slide</button>

        <div className="sidebar-divider" />
        <h4>Tools</h4>
        <button>Sort Slides</button>
        <button>Duplicate Category</button>
        <button>Delete Category</button>
        
      </aside>


      {/* 🌌 Main Section */}
      <main className="category-main">
        {header}
        {slidesContainer}
        <FloatingForest />
      </main>

      {/* ✏️ Panels (Add/Edit) */}
      {editingSlide && (
        <CategoryPanelBase
          mode="edit"
          category={category}
          slide={editingSlide}
          onSave={handleEditSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}

      {addingSlide && (
        <CategoryPanelBase
          mode="add"
          category={category}
          onSave={handleAddSlideFromPanel}
          onClose={() => setAddingSlide(false)}

          
        />
        
      )}

      

      
    </div>


    </>
  );
}

