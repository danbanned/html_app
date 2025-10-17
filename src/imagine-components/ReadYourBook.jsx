import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ReadYourBook.css";



export default function ReadYourBook({ book, onClose, onSaveBook, startChapter = 1 }) {
  const [activePage, setActivePage] = useState(0);
  const sidebarRef = useRef(null);

  // 🧩 Initialize pages from book chapters
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

  // 🧩 Add new page/chapter
  const addPage = () => {
    setPages((prev) => [...prev, { text: "", image: null }]);
    setActivePage(pages.length); // jump to new page
  };

  // 🗑️ Delete page/chapter
  const deletePage = () => {
    if (pages.length === 1) return;
    setPages((prev) => prev.filter((_, i) => i !== activePage));
    setActivePage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // 💾 Save book
  const saveBook = () => {
    const updatedBook = { ...book, chapters: pages.slice(1) }; // skip front cover
    onSaveBook(updatedBook);
    alert("✅ Book saved successfully!");
  };

  // 📜 Auto-scroll sidebar
  useEffect(() => {
    if (sidebarRef.current) sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
  }, [pages]);

  // 🎨 Handle text change
  const handleTextChange = (index, value) => {
    const updated = [...pages];
    updated[index].text = value;
    setPages(updated);
  };

  // 🖼️ Handle image change
  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...pages];
      updated[index].image = reader.result;
      setPages(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      className="read-your-book"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* HEADER */}
      <div className="reader-header">
        <h2>{book.title}</h2>
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
                className="page"
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

          {/* PAGE NAVIGATION */}
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
