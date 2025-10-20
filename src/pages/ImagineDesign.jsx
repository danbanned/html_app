import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ImagineDesign.css";
import BookMaker from "../imagine-components/BookMaker.jsx";
import AddBookPanel from "../imagine-components/AddBookPanel.jsx";
import "../styles/BookMaker.css";


export default function ImagineDesign() {
  const SLOTS = 20; // how many empty outlines you want
  // Load from localStorage -> fallback to SLOTS nulls
  const [books, setBooks] = useState(() => {
    try {
      const raw = localStorage.getItem("imagine_books_v1");
      if (!raw) return Array(SLOTS).fill(null);
      const parsed = JSON.parse(raw);
      // ensure length
      if (!Array.isArray(parsed)) return Array(SLOTS).fill(null);
      // keep length at least SLOTS
      const copy = [...parsed];
      while (copy.length < SLOTS) copy.push(null);
      return copy.slice(0, Math.max(copy.length, SLOTS));
    } catch (err) {
      console.error("Failed to parse saved books:", err);
      return Array(SLOTS).fill(null);
    }
  });

  // Sync to localStorage whenever books change
  useEffect(() => {
    try {
      localStorage.setItem("imagine_books_v1", JSON.stringify(books));
    } catch (err) {
      console.error("Failed to save books to localStorage:", err);
    }
  }, [books]);

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const [editingBook, setEditingBook] = useState(null); // null or book object

  // Open Add panel for a particular slot (create new)
  const openAddPanelForSlot = (index = null) => {
    setActiveSlotIndex(index);
    setEditingBook(null);
    setShowAddPanel(true);
  };

  // Open Add panel in EDIT mode for a given book (find its slot)
  const openEditPanelForBook = (bookToEdit) => {
    const idx = books.findIndex((b) => b && b.id === bookToEdit.id);
    setActiveSlotIndex(idx === -1 ? null : idx);
    setEditingBook(bookToEdit);
    setShowAddPanel(true);
  };

  // close panel
  const closeAddPanel = () => {
    setActiveSlotIndex(null);
    setEditingBook(null);
    setShowAddPanel(false);
  };

  // Called from AddBookPanel on submit; fills the slot at `index` (or first empty)
  // If index === null -> find first empty slot or append (preserve fixed-length behavior)
  const handleAddOrUpdateBook = (newBook, index = null) => {
    setBooks((prev) => {
      const copy = Array.from(prev);
      const id = newBook.id ?? Date.now();
      const bookWithId = { ...newBook, id };

      // If this is an update to an existing book (id matches), replace in place
      const existingIndex = copy.findIndex((b) => b && b.id === bookWithId.id);
      if (existingIndex !== -1) {
        copy[existingIndex] = bookWithId;
        return copy;
      }

      // If an index was provided (slot), place into that slot
      if (typeof index === "number" && index >= 0 && index < copy.length) {
        copy[index] = bookWithId;
        return copy;
      }

      // else place into first empty slot or append (if none empty)
      const firstEmpty = copy.findIndex((b) => b === null);
      if (firstEmpty !== -1) {
        copy[firstEmpty] = bookWithId;
        return copy;
      }
      copy.push(bookWithId);
      return copy;
    });

    // close panel afterward
    closeAddPanel();
  };

  // Delete a book by id (replace slot with null)
  const handleDeleteBook = (bookId) => {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    setBooks((prev) => {
      const copy = prev.map((b) => (b && b.id === bookId ? null : b));
      return copy;
    });
    setActiveSlotIndex(null);
    setEditingBook(null);
  };

  return (
    <div className="imagine-container">
      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => openAddPanelForSlot(books.findIndex((b) => b === null) || 0)}>
          Add Book
        </button>
        <h2>📂 Sidebar</h2>

        {/* quick list of slots for debugging / jump */}
        <div style={{ marginTop: 12 }}>
          <strong>Slots:</strong>
       <div className="slot-grid">
            {books.map((b, i) => (
              <button
                key={i}
                className="slot-btn full-cover"
                onClick={() => {
                  if (b) openEditPanelForBook(b);
                  else openAddPanelForSlot(i);
                }}
                title={b ? `Edit ${b.title}` : "Add book to this slot"}
              >
                {b ? (
                  <>
                    {b.coverImage ? (
                      <img src={b.coverImage} alt={b.title} className="slot-cover full" />
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

      {/* Main Content */}
      <motion.main
        className="main-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Pass an "onEmptySlotClick" so BookMaker can tell us which slot to fill */}
        <BookMaker
          books={books}
          setBooks={setBooks}
          onEmptySlotClick={openAddPanelForSlot}
          onEditBook={openEditPanelForBook}
          onDeleteBook={handleDeleteBook}
        />
      </motion.main>

      {/* AddBookPanel overlay */}
      <AnimatePresence>
        {showAddPanel && (
          <AddBookPanel
            key={editingBook ? `edit-${editingBook.id}` : `add-${activeSlotIndex}`}
            existingBook={editingBook || null}
            slotIndex={activeSlotIndex}
            onAddBook={(book, index = activeSlotIndex) => handleAddOrUpdateBook(book, index)}
            onClose={closeAddPanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
