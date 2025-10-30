// src/pages/CategoryPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import "../styles/CategoryPage.css";
import { useCategory } from "../components/CategoryContext.jsx";
import CategoryPanelBase from "./CategoryPanelBase.jsx";
import FloatingForest from "./FloatingForest.jsx";
import DrawingBoard from "../components/DrawingBoard.jsx";

// ✅ localforage setup (safe, async, big-storage)
localforage.config({
  name: "StoryBuilder",
  storeName: "story_slides",
});

// ✅ Save & Load using IndexedDB (via localforage)
const saveToStorage = async (key, data) => {
  try {
    await localforage.setItem(key, data);
  } catch (err) {
    console.error("💾 Error saving to IndexedDB:", err);
  }
};

const loadFromStorage = async (key, fallback = []) => {
  try {
    const saved = await localforage.getItem(key);
    return saved || fallback;
  } catch (err) {
    console.error("⚠️ Error loading from IndexedDB:", err);
    return fallback;
  }
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { categories, deleteSlide } = useCategory();

  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [addingSlide, setAddingSlide] = useState(false);
  const [expandedSlides, setExpandedSlides] = useState({});
  const [showDrawing, setShowDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);


  // 🧠 Load from IndexedDB
  useEffect(() => {
    loadFromStorage(`slides_${category}`, []).then((storedSlides) => {
      if (storedSlides.length > 0) setSlides(storedSlides);
      else {
        const defaultSlides = [
          {
            id: `placeholder-${Date.now()}`,
            title: `Add new ${category}`,
            placeholder: true,
          },
        ];
        setSlides(defaultSlides);
      }
    });
  }, [category]);

  // ✅ Expand only one
  const toggleExpand = (slideId) => {
    setExpandedSlides((prev) => {
      const newExpanded = {};
      for (const id in prev) newExpanded[id] = false;
      newExpanded[slideId] = !prev[slideId];
      return newExpanded;
    });
  };

  // ✅ Generate preset stages
  const generatePresetStages = (parentId) => {
    const presets = [
      { title: "Exposition", description: "Introduce the main idea or belief." },
      { title: "Rising Action", description: "The environment starts to change." },
      { title: "Climax", description: "The world reaches its breaking point." },
      { title: "Falling Action", description: "The setting begins to heal or shift." },
      { title: "Resolution", description: "A new balance or world order forms." },
    ];

    return presets.map((preset, i) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${i}`,
      title: preset.title,
      description: preset.description,
      placeholder: false,
      coverImage: `https://picsum.photos/seed/${encodeURIComponent(preset.title + parentId)}/300/200`,
      subStages: [],
    }));
  };

  // ➕ Add Parent Slide
  const handleAddSlideFromPanel = async (newSlide) => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomCover = `https://picsum.photos/id/${randomId}/400/300`;
    const uniqueId = Date.now().toString();

    const fullSlide = {
      ...newSlide,
      id: uniqueId,
      placeholder: false,
      coverImage: randomCover,
      children: generatePresetStages(uniqueId),
    };

    const updated = [...slides, fullSlide];
    setSlides(updated);
    await saveToStorage(`slides_${category}`, updated);
    setAddingSlide(false);
    setExpandedSlides({ [uniqueId]: true });
  };

  // ➕ Add Sub-Stage
  const handleAddSubStage = async (parentId, stageId) => {
    const updated = slides.map((slide) => {
      if (slide.id !== parentId) return slide;
      const updatedChildren = slide.children.map((stage) => {
        if (stage.id !== stageId) return stage;
        const newSubStage = {
          id: `${stage.id}-sub-${Date.now()}`,
          title: `New Sub-Stage for ${stage.title}`,
          description: "Add your sub-stage details here.",
          coverImage: coverImage?.trim()
        ? coverImage
        : `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/250/150`,
            };
        return { ...stage, subStages: [...(stage.subStages || []), newSubStage] };
      });
      return { ...slide, children: updatedChildren };
    });

    setSlides(updated);
    await saveToStorage(`slides_${category}`, updated);
  };

  // 🗑 Delete Slide/Stage/SubStage
  const handleDeleteSlide = async (id) => {
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    deleteSlide(category, id);
    await saveToStorage(`slides_${category}`, updated);
  };

  const handleDeleteStage = async (parentId, stageId) => {
    const updated = slides.map((slide) => {
      if (slide.id !== parentId) return slide;
      return { ...slide, children: slide.children.filter((s) => s.id !== stageId) };
    });
    setSlides(updated);
    await saveToStorage(`slides_${category}`, updated);
  };

  const handleDeleteSubStage = async (parentId, stageId, subId) => {
    const updated = slides.map((slide) => {
      if (slide.id !== parentId) return slide;
      const updatedChildren = slide.children.map((stage) => {
        if (stage.id !== stageId) return stage;
        return { ...stage, subStages: (stage.subStages || []).filter((s) => s.id !== subId) };
      });
      return { ...slide, children: updatedChildren };
    });
    setSlides(updated);
    await saveToStorage(`slides_${category}`, updated);
  };

  // ✏️ Edit (slide/stage/substage)
  const handleEditSlide = async (updatedItem) => {
    const updatedSlides = slides.map((slide) => {
      if (slide.id === updatedItem.id) return { ...slide, ...updatedItem };

      const updatedChildren = slide.children?.map((stage) => {
        if (stage.id === updatedItem.id) return { ...stage, ...updatedItem };
        const updatedSubs = stage.subStages?.map((sub) =>
          sub.id === updatedItem.id ? { ...sub, ...updatedItem } : sub
        );
        return { ...stage, subStages: updatedSubs };
      });

      return { ...slide, children: updatedChildren };
    });

    setSlides(updatedSlides);
    await saveToStorage(`slides_${category}`, updatedSlides);
    setEditingSlide(null);
  };

  function StoryDrawingGuide({ onClose }) {
  return (
    <div className="story-guide">
      <button className="close-guide" onClick={onClose}>✖</button>
      <h2>🎨 Story Moment Guide</h2>
      <p className="intro">
        This page helps you <strong>draw and describe</strong> every moment of your story — 
        piece by piece, detail by detail. Each drawing represents one scene, one moment, or one idea in your story.
      </p>

      <ul className="guide-steps">
        <li><strong>1️⃣ Visualize the Scene —</strong> Sketch what’s happening in this part of your story.</li>
        <li><strong>2️⃣ Add Characters & Emotion —</strong> Include who’s there, how they feel, and what they’re doing.</li>
        <li><strong>3️⃣ Describe the Action —</strong> Use the text box to narrate the moment.</li>
        <li><strong>4️⃣ Build Scene by Scene —</strong> Each drawing adds depth and flow to your story timeline.</li>
        <li><strong>5️⃣ Save & Refine —</strong> Come back anytime to edit or enhance your visuals.</li>
      </ul>

      <p className="tip">
        💡 Think of each drawing as a <em>movie frame</em> — together, they form your story’s visual rhythm.
      </p>
    </div>
  );
}

  // ✅ RENDER
  const slideElements = slides.map((slide) => (
    <div
    >
      {!slide.placeholder && (
        <>
          <div className="slide-header">
            <button
              className="expand-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(slide.id);
              }}
            >
              {expandedSlides[slide.id] ? "close " : "open slides"}
            </button>
            <div
              className="cover"
              style={{
                backgroundImage: `url(${slide.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDrawing(true);
                setEditingSlide(slide);
              }}
            />
          </div>

          <div className="meta">
            <h3>{slide.title}</h3>
            <div className="button-row">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSlide(slide);
                }}
              >
                ✏️ START HERE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSlide(slide.id);
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>

          {expandedSlides[slide.id] && (
            <div className="stages-container">
              {slide.children?.map((stage) => (
                <div key={stage.id} className="stage-card">
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  <img
                    src={stage.coverImage}
                    alt={stage.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDrawing(true);
                      setEditingSlide(stage);
                    }}
                  />
                  <div className="button-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSlide(stage);
                      }}
                    >
                      ✏️ Edit slide
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStage(slide.id, stage.id);
                      }}
                    >
                      🗑 Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSubStage(slide.id, stage.id);
                      }}
                    >
                      ➕ ADD NEW STAGE
                    </button>
                  </div>

                  

                  <div className="substage-container">
                    {stage.subStages?.map((sub) => (
                      <div key={sub.id} className="substage-card">
                        <h4>{sub.title}</h4>
                        <img
                          src={sub.coverImage}
                          alt={sub.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDrawing(true);
                            setEditingSlide(sub);
                          }}
                        />
                        <div className="button-row-BABY-BUTTONS">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSlide(sub);
                            }}
                          >
                            ✏️ EDIT
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubStage(slide.id, stage.id, sub.id);
                            }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  ));

  return (
    <div className="category-layout">
      <aside className="category-sidebar">
        <FloatingForest />
        <h3>{category?.toUpperCase()}</h3>
        <p>{slides.length} stories</p>
        <div className="sidebar-divider" />
        <button className="add-btn" onClick={() => setAddingSlide(true)}>
          + Add Story
        </button>
        <button className="back-btn" onClick={() => navigate("/storyboardpage")}>
          ← Back
        </button>

          <button className="guide-btn" onClick={() => setShowGuide(true)}>
            📘 Guide
          </button>

        <button
          className="clear-btn"
          onClick={async () => {
            await localforage.removeItem(`slides_${category}`);
            setSlides([]);
          }}
        >
          🗑️ Clear Saved
        </button>

        
      </aside>


      <main className="category-main">
        
        <header className="category-header">
          
          <h2>{category?.toUpperCase()}</h2>
        </header>
        <div className="slides-viewport" ref={useRef(null)}>
          
          <div className="slides-track">{slideElements}</div>
          
        </div>
      </main>
            {showGuide && (
            <div className="guide-overlay" onClick={() => setShowGuide(false)}>
              <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
                <StoryDrawingGuide onClose={() => setShowGuide(false)} />
              </div>
            </div>
          )}
      {/* 🌿 Floating forest overlay */}
    

      {editingSlide && !showDrawing && (
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

      {showDrawing && editingSlide && (
        <div className="drawing-overlay">
          <div className="drawing-popup">
            <button
              className="close-btn"
              onClick={() => {
                setShowDrawing(false);
                setEditingSlide(null);
              }}
            >
              ✖ 
            </button>
            <DrawingBoard
              width={900}
              height={600}
              initialColor="#111827"
              initialSize={6}
              category={category}
              slideId={editingSlide.id}
              slideName={editingSlide.title}
              onSaveDrawing={async (imageData, slideId) => {
                const updated = slides.map((s) =>
                  s.id === slideId ? { ...s, drawing: imageData } : s
                );
                setSlides(updated);
                await saveToStorage(`slides_${category}`, updated);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
