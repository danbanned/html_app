import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ReadYourBook.css";
import { useAI } from "../ai/aiIntegration"; // 🧠 AI import

export default function ReadYourBook({ book, onClose, onSaveBook, startChapter = 1 }) {
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages] = useState(() => [
    {
      text: `${book.title}\nby ${book.author}\nGenre: ${book.genre}\nID: ${book.id}`,
      image: book.coverImage || null,
      isFrontCover: true,
    },
    ...(book.chapters?.length
      ? book.chapters.map((c, idx) => ({
          ...c,
          number: idx + startChapter,
        }))
      : [{ text: "Empty chapter", image: "" }]),
  ]);

  const [aiLoading, setAILoading] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState("");
  const sidebarRef = useRef(null);

  // Add / Delete / Save / Edit logic same as before...
  const addPage = () => {
    setPages((prev) => [...prev, { text: "", image: null }]);
    setActivePage(pages.length);
  };
  const deletePage = () => {
    if (pages.length === 1) return;
    setPages((prev) => prev.filter((_, i) => i !== activePage));
    setActivePage((prev) => (prev > 0 ? prev - 1 : 0));
  };
  const saveBook = () => {
    const updatedBook = { ...book, chapters: pages.slice(1) };
    onSaveBook(updatedBook);
    alert("✅ Book saved successfully!");
  };

  useEffect(() => {
    if (sidebarRef.current) sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
  }, [pages]);

  const handleTextChange = (index, value) => {
    const updated = [...pages];
    updated[index].text = value;
    setPages(updated);
  };
  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...pages];
      updated[index].image = reader.result;
      setPages(updated);
    };
    reader.readAsDataURL(file);
  };

  // 🧠 AI GENERATION
  const handleAIGenerate = async () => {
    setAILoading(true);
    const currentText = pages[activePage].text;
    const suggestion = await useAI("suggestNextChapter", {
      title: book.title,
      chapter: activePage,
      text: currentText,
    });
    setAISuggestion(suggestion);
    setAILoading(false);
  };

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;
    const updated = [...pages];
    updated[activePage].text += `\n\n${aiSuggestion}`;
    setPages(updated);
    setAISuggestion("");
  };

  return (
    <motion.div
      className="read-your-book gothic-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="reader-header">
        <h2 className="enchanted-title">{book.title}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="book-layout">
        {/* SIDEBAR */}
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-section">
            <h4>Description</h4>
            <p>{book.description}</p>
          </div>

          <div className="sidebar-section">
            <h4>Tags</h4>
            {book.tags && Object.entries(book.tags).map(([category, list]) =>
              list.length > 0 && (
                <div key={category}>
                  <strong>{category}</strong>
                  <div className="tag-bubbles">
                    {list.map((tag) => (
                      <span key={tag.name} className="bubble" style={{ backgroundColor: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 🧠 AI Panel */}
          <div className="sidebar-section ai-section">
            <motion.h4
              className="ai-header"
              animate={{ textShadow: ["0 0 8px #9fdcff", "0 0 16px #7de0ff", "0 0 8px #9fdcff"] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🔮 AI Assistant
            </motion.h4>

            <motion.button
              className="ai-button"
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px #6be2ff" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAIGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? "✨ Summoning Ideas..." : "Invoke Inspiration"}
            </motion.button>

            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  className="ai-suggestion"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>{aiSuggestion}</p>
                  <button className="apply-ai" onClick={applyAISuggestion}>📜 Transcribe Into Page</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sidebar-buttons">
            <button onClick={addPage}>➕ Add Page</button>
            <button onClick={deletePage} disabled={pages.length === 1}>🗑️ Delete Page</button>
            <button onClick={saveBook}>💾 Save Book</button>
          </div>
        </div>

        {/* MAIN BOOK VIEW */}
        <div className="book-view">
          <AnimatePresence mode="wait">
            {pages[activePage] && (
              <motion.div
                key={activePage}
                className="page enchanted-page"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <textarea
                  className="page-text"
                  value={pages[activePage].text}
                  onChange={(e) => handleTextChange(activePage, e.target.value)}
                  placeholder="Start writing your story..."
                />
                {pages[activePage].image && (
                  <img src={pages[activePage].image} alt="page visual" className="page-image" />
                )}
                <label className="image-upload">
                  📸 Add Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(activePage, e.target.files[0])}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="page-controls">
            <button disabled={activePage === 0} onClick={() => setActivePage((p) => p - 1)}>◀ Prev</button>
            <span>Page {activePage + 1} of {pages.length}</span>
            <button disabled={activePage === pages.length - 1} onClick={() => setActivePage((p) => p + 1)}>Next ▶</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
