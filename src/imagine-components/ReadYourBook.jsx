import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ReadYourBook.css";
import { useChatCompletion } from "../hooks/useChatCompletion";

// 🌈 BOOK READER PREVIEW (from BookMaker)
export function BookReader({ book, onClose, onStartReading }) {
  console.log("📘 BookReader loaded:", book);

  return (
    <motion.div
      className="book-reader"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      style={{
        background: `linear-gradient(145deg, ${book.coverColor}66, #f8f8f8)`,
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="book-reader-header">
        <button className="close-btn" onClick={onClose}>✕</button>

        {book.coverImage && (
          <motion.div
            className="book-cover-frame"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={book.coverImage} alt={book.title} className="book-cover" />
            <div className="cover-overlay"></div>
          </motion.div>
        )}

        <motion.div
          className="book-meta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>{book.title}</h2>
          <h4>by {book.author}</h4>
          <p className="book-genre-tag">{book.genre}</p>
        </motion.div>
      </div>

      <motion.div
        className="book-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="book-description">{book.description || "No description provided."}</p>

        {book.tags && (
          <div className="tag-section">
            {Object.entries(book.tags).map(([category, list]) =>
              list.length > 0 && (
                <div key={category} className="tag-block">
                  <h5>{category.toUpperCase()}</h5>
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
        )}

        <div className="reader-buttons">
          <button className="continue-btn" onClick={() => {
            console.log("▶️ Start reading book:", book);
            onStartReading(book);
          }}>
            📖 Start Reading
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 🧠 FULL PAGE BOOK READER
export default function ReadYourBook({ book, onClose, onSaveBook, startChapter = 1 }) {
  console.log("📗 ReadYourBook loaded with book:", book);

  const [activePage, setActivePage] = useState(0);
  const [aiLoading, setAILoading] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState("");
  const chatMutation = useChatCompletion();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

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

  console.log("📄 Initial pages:", pages);

  const printmessage = () => {
    console.log("📘 Chapters button clicked — chapters feature not yet implemented");
    alert("Chapters coming soon");
  };

  const addPage = () => {
    console.log("➕ Adding new page...");
    setPages((prev) => {
      const updated = [...prev, { text: "", image: null }];
      console.log("📄 Updated pages:", updated);
      return updated;
    });
    setActivePage(pages.length);
  };

  const deletePage = () => {
    console.log("🗑️ Deleting page", activePage);
    if (pages.length === 1) return;
    setPages((prev) => {
      const updated = prev.filter((_, i) => i !== activePage);
      console.log("📄 Updated pages after delete:", updated);
      return updated;
    });
    setActivePage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const saveBook = () => {
    const updatedBook = { ...book, chapters: pages.slice(1) };
    console.log("💾 Saving book:", updatedBook);
    onSaveBook(updatedBook);
    alert("✅ Book saved successfully!");
  };

  useEffect(() => {
    if (sidebarRef.current) sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
  }, [pages]);

  const handleTextChange = (index, value) => {
    console.log(`✏️ Updating text for page ${index}:`, value.slice(0, 50), "...");
    const updated = [...pages];
    updated[index].text = value;
    setPages(updated);
  };

  const handleImageChange = (index, file) => {
    console.log(`🖼️ Image upload detected on page ${index}:`, file?.name);
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...pages];
      updated[index].image = reader.result;
      setPages(updated);
    };
    reader.readAsDataURL(file);
  };

  
  const handleAIGenerate = async () => {
  console.log("🔮 AI Generation started for page", activePage);
  try {
    setAILoading(true);

    // Clean the current page text to remove any placeholders
    const currentText = pages[activePage].text.replace(/✨ No suggestion returned —.*/g, "").trim() || "Once upon a time...";

    const payload = {
      mode: "storyContinuation",
      bookContext: {
        title: book.title || "Untitled",
        genre: book.genre || "General",
        chapter: activePage + 1,
        text: currentText,
      },
    };

    console.log("🔮 Sending to AI:", payload);

    const aiResponse = await chatMutation.mutateAsync(payload);

    console.log("🤖 Raw AI Response:", aiResponse);

    // Safely extract content
    const content =
      aiResponse?.content?.trim() ||
      "🤔 The AI could not generate a continuation. Try again!";

    setAISuggestion(content);

    // Optional: log image prompt
    if (aiResponse?.imagePrompt) {
      console.log("🎨 AI Image Prompt:", aiResponse.imagePrompt);
    }
  } catch (err) {
    console.error("❌ AI generation failed:", err);
    setAISuggestion("⚠️ The AI could not generate a continuation right now.");
  } finally {
    setAILoading(false);
  }
};

const applyAISuggestion = () => {
    console.log("📜 Applying AI suggestion:", aiSuggestion);
    if (!aiSuggestion) return;
    const updated = [...pages];
    updated[activePage].text += `\n\n${aiSuggestion}`;
    setPages(updated);
    setAISuggestion("");
  };



  // Debug sidebar toggle and page changes
  useEffect(() => {
    console.log("📖 Active page changed:", activePage, pages[activePage]);
  }, [activePage]);

  useEffect(() => {
    console.log("🧩 Sidebar visibility:", sidebarOpen);
  }, [sidebarOpen]);

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
        {/* 📚 Sidebar */}
        <motion.div
          className="sidebar"
          ref={sidebarRef}
          animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {sidebarOpen && (
            <>
              <div className="sidebar-section">
                <h4>Description</h4>
                <p>{book.description}</p>
              </div>

              <div className="sidebar-section">
                <h4>Tags</h4>
                {book.tags &&
                  Object.entries(book.tags).map(
                    ([category, list]) =>
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

              {/* 🧠 AI Assistant */}
              <div className="sidebar-section ai-section">
                <motion.h4
                  className="ai-header"
                  animate={{
                    textShadow: ["0 0 8px #9fdcff", "0 0 16px #7de0ff", "0 0 8px #9fdcff"],
                  }}
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
                      <button className="apply-ai" onClick={applyAISuggestion}>
                        📜 Transcribe Into Page
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sidebar-buttons">
                <button onClick={addPage}>➕ Add Page</button>
                <button onClick={deletePage} disabled={pages.length === 1}>
                  🗑️ Delete Page
                </button>
                <button onClick={saveBook}>💾 Save Book</button>
                <button onClick={printmessage}>📘 Chapters</button>
              </div>
            </>
          )}
        </motion.div>

        {/* 🔘 Sidebar Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => {
            console.log("🪟 Sidebar toggle clicked:", !sidebarOpen);
            setSidebarOpen(!sidebarOpen);
          }}
        >
          {sidebarOpen ? "❯" : "❮"}
        </button>

        {/* 📖 MAIN BOOK VIEW */}
        <motion.div
          className="book-view"
          animate={{
            width: sidebarOpen ? "calc(100% - 260px)" : "100%",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* 📘 Current Book Header */}
          <div className="current-book-header">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="current-book-cover" />
            ) : (
              <div className="current-book-placeholder">📖 No Cover</div>
            )}
            <div className="current-book-info">
              <h2>{book.title}</h2>
              <p>by {book.author || "Unknown Author"}</p>
            </div>
          </div>

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
            <button
              disabled={activePage === 0}
              onClick={() => setActivePage((p) => {
                console.log("⬅️ Prev Page clicked");
                return p - 1;
              })}
            >
              ◀ Prev
            </button>
            <span>Page {activePage + 1} of {pages.length}</span>
            <button
              disabled={activePage === pages.length - 1}
              onClick={() => setActivePage((p) => {
                console.log("➡️ Next Page clicked");
                return p + 1;
              })}
            >
              Next ▶
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
