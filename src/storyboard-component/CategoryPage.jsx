import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import "../styles/CategoryPage.css";
import { useCategory } from "../components/CategoryContext.jsx";
import CategoryPanelBase from "./CategoryPanelBase.jsx";
import FloatingForest from "./FloatingForest.jsx";
import DrawingBoard from "../components/DrawingBoard.jsx";
import { useStoryCoach } from "../hooks/useStoryCoach.js";
import { useBooks } from "../components/BookContext.jsx";
import "..styles/FloatingAIPanel.css";
import { STATUS } from "react-joyride";
import { useTutorial } from "../components/TutorialContext.jsx";


const saveToStorage = async (key, data) => {
  try {
    await localforage.setItem(key, data);
  } catch (err) {
    console.error("💾 Error saving:", err);
  }
};

const loadFromStorage = async (key, fallback = []) => {
  try {
    const saved = await localforage.getItem(key);
    return saved || fallback;
  } catch (err) {
    console.error("⚠️ Load error:", err);
    return fallback;
  }
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { deleteSlide } = useCategory();

  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [addingSlide, setAddingSlide] = useState(false);
  const [expandedSlides, setExpandedSlides] = useState({});
  const [showDrawing, setShowDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { books } = useBooks();

  const storyCoach = useStoryCoach(); // ✅ Initialize AI hook
  const { storyTourDone, designTourDone } = useTutorial();
  const [runGuide, setRunGuide] = useState(false);

   // Auto-start tutorial only after ImagineDesign tour completes
  useEffect(() => {
    if (designTourDone) {
      setRunGuide(true);
    }
  }, [designTourDone]);

  const handleGuideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunGuide(false);
    }
  };

  const guideSteps = [
  {
    target: ".category-sidebar",
    content: "This is your story library and controls.",
    placement: "right",
  },
  {
    target: ".slides-viewport",
    content: "All your slides are displayed here. Click to edit.",
    placement: "top",
  },
  {
    target: ".add-btn",
    content: "Click here to add a new story slide.",
    placement: "bottom",
  },
  {
    target: ".guide-btn",
    content: "You can reopen this guide anytime.",
    placement: "left",
  },
];


  useEffect(() => {
    loadFromStorage(`slides_${category}`, []).then((stored) => {
      if (stored.length > 0) setSlides(stored);
      else
        setSlides([
          {
            id: `placeholder-${Date.now()}`,
            title: `Add new ${category}`,
            placeholder: true,
          },
        ]);
    });
  }, [category]);

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
      coverImage: `https://picsum.photos/seed/${encodeURIComponent(
        preset.title + parentId
      )}/300/200`,
      subStages: [],
    }));
  };

  const handleAddSlideFromPanel = async (newSlide) => {
    const randomCover = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/400/300`;
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

    const latestBook = books[books.length - 1];
    if (latestBook) {
      storyCoach.setBook(latestBook);
      await storyCoach.sendMessage(latestBook); // Pass book object
    }
  };

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

  const handleDeleteSlide = async (id) => {
  const updated = slides.filter((s) => s.id !== id);
  setSlides(updated);

  // Remove from category context if needed
  if (deleteSlide) deleteSlide(category, id);

  // Save updated slides to persistent storage
  await saveToStorage(`slides_${category}`, updated);

  console.log("🗑 Slide deleted permanently:", id);
};


  const toggleExpand = (slideId) => {
    setExpandedSlides((prev) => {
      const newExpanded = {};
      for (const id in prev) newExpanded[id] = false;
      newExpanded[slideId] = !prev[slideId];
      return newExpanded;
    });
  };

  const handleAddSubStage = async (parentId, stageId) => {
    const updated = slides.map((slide) => {
      if (slide.id !== parentId) return slide;
      const updatedChildren = slide.children.map((stage) => {
        if (stage.id !== stageId) return stage;
        const newSubStage = {
          id: `${stage.id}-sub-${Date.now()}`,
          title: `New Sub-Stage for ${stage.title}`,
          description: "Add your sub-stage details here.",
          coverImage: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/250/150`,
        };
        return { ...stage, subStages: [...(stage.subStages || []), newSubStage] };
      });
      return { ...slide, children: updatedChildren };
    });

    setSlides(updated);
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

  const handleAskAI = async () => {
    const latestBook = books?.[books.length - 1];
    if (!latestBook) return;

    const result = await storyCoach.sendMessage(
      `A story titled "${latestBook.title || "Untitled"}" was added.
      Description: "${latestBook.description || "No description provided"}".
      Give concise writing advice and a creative visual concept for inspiration.
      Format response as:
      Writing Advice: ...
      Visual Concept: ...`
    );

    const aiText =
      result?.description || result?.content || result || "No response received from StoryCoach.";

    const adviceMatch = aiText.match(/Writing Advice:\s*(.*?)(?:\n|$)/i);
    const imageMatch = aiText.match(/Visual\s*Concept\s*[:\-]\s*(.+)/i);

    const advice = adviceMatch ? adviceMatch[1].trim() : aiText;
    const imagePrompt = imageMatch
      ? imageMatch[1].trim()
      : `Concept art for a story titled "${latestBook.title}"`;

    storyCoach.setLatestResponse({ description: advice, imagePrompt });
  };

  function StoryDrawingGuide({ onClose }) {
    return (
      <div className="story-guide">
        <button className="close-guide" onClick={onClose}>✖</button>
        <h2>🎨 Story Moment Guide</h2>
        <p className="intro">
          This helps you <strong>draw and describe</strong> your story moments, one scene at a time.
        </p>
        <ul className="guide-steps">
          <li><strong>1️⃣ Visualize the Scene —</strong> Sketch the moment.</li>
          <li><strong>2️⃣ Add Emotion —</strong> Capture who’s there & how they feel.</li>
          <li><strong>3️⃣ Describe the Action —</strong> Write the key moment below.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="category-layout">

      {/* Joyride Tutorial */}
    <Joyride
      steps={guideSteps}
      run={runGuide}
      continuous
      showSkipButton
      callback={handleGuideCallback}
      styles={{ options: { zIndex: 10000 } }}
    />
      {/* Sidebar */}
      <aside className="category-sidebar">
        <FloatingForest />
        <div className="sidebar-header">
          <h3>{category?.toUpperCase()}</h3>
          <p>{slides.length} stories</p>
        </div>
        <div className="sidebar-actions">
          <button className="add-btn" onClick={() => setAddingSlide(true)}>+ Add Story</button>
          <button className="back-btn" onClick={() => navigate("/storyboardpage")}>← Back</button>
          <button className="guide-btn" onClick={() => setShowGuide(true)}>📘 Guide</button>
          <button
            className="clear-btn"
            onClick={async () => {
              await localforage.removeItem(`slides_${category}`);
              setSlides([]);
            }}
          >
            🗑️ Clear Saved
          </button>
        </div>

        {/* Story Coach */}
        <div className="story-coach-sidebar">
          <h2>🧠 Story Coach</h2>
          <button
            onClick={handleAskAI}
            disabled={storyCoach.isThinking}
            className="ask-button"
          >
            {storyCoach.isThinking ? "Thinking..." : "Ask Story Coach"}
          </button>

          <div className="ai-chat">
            {storyCoach.messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${msg.role === "assistant" ? "assistant" : "user"}`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {storyCoach.latestResponse && (
            <div className="coach-response flex-container">
              {/* Advice */}
              <div className="advice-section">
                <h3>Coach’s Advice</h3>
                {/* Only show advice if it's not the last chat message */}
                <p>
                  {storyCoach.latestResponse.description &&
                  storyCoach.latestResponse.description !== storyCoach.messages[storyCoach.messages.length - 1]?.content
                    ? storyCoach.latestResponse.description
                    : "No new advice yet."}
                </p>           
            </div>

                {/* Visual Concept */}
                {storyCoach.images?.length > 0 && (
                  <div className="visual-section">
                    <h3>Suggested Visual Concept</h3>
                    <img
                      src={storyCoach.images[storyCoach.images.length - 1]} // latest image
                      alt="AI suggested concept"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/400x300?text=No+Image+Available")
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>


        {showGuide && (
          <div className="guide-overlay" onClick={() => setShowGuide(false)}>
            <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
              <StoryDrawingGuide onClose={() => setShowGuide(false)} />
            </div>
          </div>
        )}
      </aside>

      {/* Slides */}
      <main className="category-main">
        <header className="category-header">
          <h2>{category?.toUpperCase()}</h2>
        </header>
        <div className="slides-viewport" ref={useRef(null)}>
          <div className="slides-track">
            {slides.map((slide) => (
              <div key={slide.id}>
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
                        <button onClick={() => setEditingSlide(slide)}>✏️ START HERE</button>
                        <button onClick={() => handleDeleteSlide(slide.id)}>🗑 Delete</button>
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
                              onClick={() => {
                                setShowDrawing(true);
                                setEditingSlide(stage);
                              }}
                            />
                            <div className="button-row">
                              <button onClick={() => setEditingSlide(stage)}>✏️ Edit</button>
                              <button onClick={() => handleDeleteStage(slide.id, stage.id)}>🗑 Delete</button>
                              <button onClick={() => handleAddSubStage(slide.id, stage.id)}>➕ Add Stage</button>
                            </div>
                            <div className="substage-container">
                              {stage.subStages?.map((sub) => (
                                <div key={sub.id} className="substage-card">
                                  <h4>{sub.title}</h4>
                                  <img
                                    src={sub.coverImage}
                                    alt={sub.title}
                                    onClick={() => {
                                      setShowDrawing(true);
                                      setEditingSlide(sub);
                                    }}
                                  />
                                  <div className="button-row-BABY-BUTTONS">
                                    <button onClick={() => setEditingSlide(sub)}>✏️ Edit</button>
                                    <button onClick={() => handleDeleteSubStage(slide.id, stage.id, sub.id)}>🗑 Delete</button>
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
            ))}
          </div>
        </div>
      </main>

      {/* Panels */}
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

      {/* Drawing Board */}
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
