import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ImagineDesign.css";
import { getBooks, saveBooks } from "../utils/indexedDB.js";
import Joyride, { STATUS } from "react-joyride";
import { useTutorial } from "../components/TutorialContext";
import {useNavigate} from "react-router-dom";


import BookMaker from "../imagine-components/BookMaker.jsx";
import AddBookPanel from "../imagine-components/AddBookPanel.jsx";
import ReadYourBook, { BookReader } from "../imagine-components/ReadYourBook.jsx";

export default function ImagineDesign() {
  const SLOTS = 2;

  /* ============================================================
   * 🧩 INITIAL STATE
   * ============================================================ */
  const [books, setBooks] = useState(Array(SLOTS).fill(null));
  const { storyTourDone, designTourDone, setDesignTourDone } = useTutorial();
const [run, setRun] = useState(true);
  const navigation = useNavigate();

  /* ============================================================
   * 📖 AUTO-START TUTORIAL (triggered after StoryPage finishes)
   * ============================================================ */
useEffect(() => {
    if (storyTourDone && !designTourDone) {
    }
  }, [storyTourDone, designTourDone]);

  const handleJoyridecallback = (data) => {
  const { status, index, action } = data;
   console.log("🎯 Joyride data:", data);

  // When the user reaches the last step and clicks "Next"
  if (action === "next" && index === steps.length - 1) {
    console.log("🎯 Finished last Joyride step — redirecting to /category/theme");
    setDesignTourDone(true);
    navigation("/category/theme");
  }

  // Optional: handle if the user skips
  if ([STATUS.SKIPPED].includes(status)) {
    console.log("⚠️ User skipped tutorial, redirecting anyway...");
    setDesignTourDone(true);
    navigation("/category/theme");
  }
};
  
  // 🧭 Joyride tutorial steps

  
  const steps = [
    {
      target: ".sidebar",
      content: "Welcome to your Library! This is where all your books live.",
      placement: "right",
    },
    {
      target: ".slot-overlay",
      content: "Each slot holds a book. Click + to create or edit one.",
      placement: "top",
    },
    {
      target: ".main-content",
      content: "Here’s your design area — this is where you imagine and create.",
      placement: "top",
    },
    {
      target: ".imagine-container",
      content: "You can use ☰ to reopen the Library sidebar and x to close it anytime.",
      placement: "right",
    },
  ];
 

  /* ============================================================
   * 📚 BOOK STORAGE (unchanged)
   * ============================================================ */
  useEffect(() => {
    (async () => {
      try {
        const storedBooks = await getBooks();
        if (storedBooks && storedBooks.length > 0) {
          setBooks([...storedBooks, ...Array(SLOTS).fill(null)].slice(0, SLOTS));
          console.log("📚 Loaded books from IndexedDB:", storedBooks);
        } else {
          console.log("📭 No books found in IndexedDB, starting fresh.");
        }
      } catch (err) {
        console.error("⚠️ Failed to load books from IndexedDB:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (books && books.length > 0) {
      saveBooks(books)
        .then(() => console.log("💾 Books saved to IndexedDB"))
        .catch((err) => console.error("⚠️ Failed to save books:", err));
    }
  }, [books]);

  useEffect(() => {
    getBooks()
      .then((storedBooks) => {
        if (storedBooks.length > 0) {
          setBooks(storedBooks);
          console.log("📚 Loaded books from IndexedDB");
        }
      })
      .catch((err) => console.error("⚠️ Could not load books:", err));
  }, []);

  /* ============================================================
   * ⚙️ UI STATES
   * ============================================================ */
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewBook, setPreviewBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);

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

  const handleDeleteBook = async (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    await deleteBook(bookId);
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
    setPreviewBook(null);
    setReadingBook(book);
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
      {/* 🧭 Auto-start Joyride tutorial */}
      {console.log("✅ Joyride rendered")}

      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        disableBeacon
        callback={handleJoyridecallback}
        styles={{ options: { zIndex: 10000 } }}
      />
      {/* your existing page JSX stays exactly as it is */}

      {/* ========== Book Preview ========== */}
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
              onClose={closePreview}
              onStartReading={startReadingBook}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== Full Reader ========== */}
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
                </div>

                <div className="slot-grid">
                  {books.map((b, i) => (
                    <button
                      key={i}
                      className="slot-btn full-cover"
                      onClick={() => (b ? openPreviewForBook(b) : openAddPanelForSlot(i))}
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

      {/* Sidebar Toggle */}
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

      {/* Main Area (BookMaker Grid) */}
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
              setSidebarOpen(false);
              setPreviewBook(book);
            }}
          />
        </motion.main>
      )}

      {/* Add/Edit Book Panel */}
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
