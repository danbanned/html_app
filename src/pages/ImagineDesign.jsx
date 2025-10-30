import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ImagineDesign.css";
import BookMaker from "../imagine-components/BookMaker.jsx";
import AddBookPanel from "../imagine-components/AddBookPanel.jsx";
import ReadYourBook from "../imagine-components/ReadYourBook.jsx";
import { BookReader } from "../imagine-components/ReadYourBook.jsx"; // ✅ Import the preview

export default function ImagineDesign() {
  const SLOTS = 2;

  /* ============================================================
   * 🧩 INITIAL STATE
   * ============================================================ */
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem("imagine_books_v1");
      if (!saved) return Array(SLOTS).fill(null);
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? [...parsed, ...Array(SLOTS).fill(null)].slice(0, SLOTS)
        : Array(SLOTS).fill(null);
    } catch {
      return Array(SLOTS).fill(null);
    }
  });

  useEffect(() => {
    localStorage.setItem("imagine_books_v1", JSON.stringify(books));
  }, [books]);

  /* ============================================================
   * ⚙️ UI STATES
   * ============================================================ */
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewBook, setPreviewBook] = useState(null); // 👁 Preview (BookReader)
  const [readingBook, setReadingBook] = useState(null); // 📖 Full Reader (ReadYourBook)

  /* ============================================================
   * 🪟 PANEL HANDLERS
   * ============================================================ */
  const openAddPanelForSlot = (index = null) => {
    setActiveSlotIndex(index);
    setEditingBook(null);
    setShowAddPanel(true);
  };

  const openEditPanelForBook = (book) => {
    const idx = books.findIndex((b) => b && b.id === book.id);
    setActiveSlotIndex(idx);
    setEditingBook(book);
    setShowAddPanel(true);
  };

  const closeAddPanel = () => {
    setShowAddPanel(false);
    setActiveSlotIndex(null);
    setEditingBook(null);
  };

  /* ============================================================
   * 📚 BOOK HANDLERS
   * ============================================================ */
  const handleAddOrUpdateBook = (newBook, index = null) => {
    setBooks((prev) => {
      const updated = [...prev];
      const id = newBook.id ?? Date.now();
      const book = { ...newBook, id };
      const existingIndex = updated.findIndex((b) => b && b.id === book.id);
      if (existingIndex !== -1) updated[existingIndex] = book;
      else if (index != null && index < updated.length) updated[index] = book;
      else updated.push(book);
      return updated;
    });
    closeAddPanel();
  };

  const handleDeleteBook = (bookId) => {
    if (!confirm("Delete this book?")) return;
    setBooks((prev) => prev.map((b) => (b && b.id === bookId ? null : b)));
  };

  const handleSaveBook = (updatedBook) => {
    setBooks((prev) => prev.map((b) => (b?.id === updatedBook.id ? updatedBook : b)));
    localStorage.setItem("imagine_books_v1", JSON.stringify(books));
  };

  /* ============================================================
   * 📖 READER HANDLERS
   * ============================================================ */
  const openPreviewForBook = (book) => setPreviewBook(book);
  const closePreview = () => setPreviewBook(null);

  const startReadingBook = (book) => {
    setPreviewBook(null); // close preview
    setReadingBook(book); // open full reader
  };

  const closeReader = () => setReadingBook(null);

  /* ============================================================
   * 🧭 SIDEBAR
   * ============================================================ */
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  /* ============================================================
   * 🎨 RENDER
   * ============================================================ */
  return (
    <div className="imagine-container">
      {/* ========== Book Reader Preview ========== */}
      <AnimatePresence>
        {previewBook && (
          <motion.div
            key="book-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="reader-overlay"
          >
            <BookReader
              book={previewBook}
              onClose={() => {
                {closePreview};
                {closeAddPanel};
              }}
              onStartReading={startReadingBook}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== Full Reader (Writing Mode) ========== */}
      <AnimatePresence>
        {readingBook && (
          <motion.div
            key="read-your-book"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="reader-overlay"
          >
            <ReadYourBook
              book={readingBook}
              onClose={closeReader}
              onSaveBook={handleSaveBook}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== Sidebar ========== */}
      {!previewBook && !readingBook && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="sidebar"
              initial={{ x: -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -220, opacity: 0 }}
            >
              <div className="sidebar-header">
                <h2>📚 My Books</h2>
                <button onClick={toggleSidebar}>✕</button>
              </div>

              <div className="sidebar-content">
                <div className="slot-toolbar">
                  <strong>Library</strong>
                  <button
                    className="addbookbutton"
                    onClick={() =>
                      openAddPanelForSlot(books.findIndex((b) => b === null) || 0)
                    }
                  >
                    ＋ Add Book
                  </button>
                </div>

                <div className="slot-grid">
                  {books.map((b, i) => (
                    <button
                      key={i}
                      className="slot-btn full-cover"
                      onClick={() => {
                        {closeAddPanel};
                        b ? openPreviewForBook(b) : openAddPanelForSlot(i)
                      }}
                    >
                      {b ? (
                        <>
                          {b.coverImage ? (
                            <img
                              src={b.coverImage}
                              alt={b.title}
                              className="slot-cover full"
                            />
                          ) : (
                            <div className="no-cover">No Cover</div>
                          )}
                          <div className="slot-overlay">
                            <span className="slot-title">{b.title}</span>
                          </div>
                        </>
                      ) : (
                        <span className="add-text">+ {i + 1}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* ========== Sidebar Toggle ========== */}
      {!sidebarOpen && !previewBook && !readingBook && (
        <motion.button
          className="open-sidebar-btn"
          onClick={toggleSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ☰
        </motion.button>
      )}

      {/* ========== Main Content ========== */}
      {!previewBook && !readingBook && (
        <motion.main
          className="main-content"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <BookMaker
        books={books}
        setBooks={setBooks}
        onEmptySlotClick={openAddPanelForSlot}
        onEditBook={openEditPanelForBook}
        onDeleteBook={handleDeleteBook}
        onOpenBook={(book) => {
          setSidebarOpen(false);      // 👈 CLOSE the sidebar
          setPreviewBook(book);       // 👈 OPEN the preview
        }}
      />

        </motion.main>
      )}

      {/* ========== Add/Edit Book Panel ========== */}
      <AnimatePresence>
        {showAddPanel && !previewBook && !readingBook && (
          <AddBookPanel
            key={editingBook ? `edit-${editingBook.id}` : `add-${activeSlotIndex}`}
            existingBook={editingBook}
            slotIndex={activeSlotIndex}
            onAddBook={(book, idx = activeSlotIndex) =>
              handleAddOrUpdateBook(book, idx)
            }
            onClose={closeAddPanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
