import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/BookMaker.css";
import EditBookPanel from "./EditBookPanel.jsx";
import { saveBooks, getBooks, deleteBook } from "../utils/indexedDB.js";
import AddBookPanel from "./AddBookPanel.jsx";
import  ReadYourBook, {BookReader} from "./ReadYourBook.jsx";
import Joyride from "react-joyride"; // ✅ guided tour
import { STATUS } from "react-joyride"; // 👈 make sure you import STATUS
import { useTutorial } from "../components/TutorialContext";


// 📚 BOOK SHELF (shows books + keeps empty placeholders visible)
function BookShelf({ books, onOpen, onEmptySlotClick, onEdit, onDelete, onAddBook }) {
  /* ============================================================
   * 🧩 INITIAL STATE
   * ============================================================ */

  const totalSlots = 12;
  const filled = books.filter(Boolean);
  const emptySlots = totalSlots - filled.length;
  const { storyTourDone, designTourDone, setDesignTourDone } = useTutorial();
  const [run, setRun] = useState(false);



   /* ============================================================
     * 📖 AUTO-START TUTORIAL (triggered after StoryPage finishes)
     * ============================================================ */
  
     useEffect(() => {
    // Only start if story tour just finished and this one hasn’t run yet
    if (storyTourDone && !designTourDone) {
      setRun(true);
    }
  }, [storyTourDone, designTourDone]);
  
    const handleJoyrideCallback = (data) => {
      const { status } = data;
      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        setRun(false);
        setDesignTourDone(true);
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

  return (
    <div className="book-shelf">

       {/* 🧭 Auto-start Joyride tutorial */}
      <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        callback={handleJoyrideCallback}
        showSkipButton
        styles={{ options: { zIndex: 10000 } }}
      />
      {/* your existing page JSX stays exactly as it is */}
    </>
      {/* Render filled book cards */}
      {filled.map((book) => (
        <motion.div
          key={book.id}
          className="book-card"
          style={{ backgroundColor: book.coverColor }}
          whileHover={{
            rotateY: 20,
            rotateX: -15,
            scale: 1.1,
            boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div className="book-shine"></div>
          {book.coverImage && <img src={book.coverImage} alt={book.title} />}

          <div className="book-card-actions">
            <button className="edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(book); }}>✎</button>
            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}>🗑</button>
          </div>

          <div className="book-details" onClick={() => onOpen(book)}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.genre}</p>
            {book.chapters?.length > 0 && (
              <span className="chapter-count">📖 {book.chapters.length} Chapters</span>
            )}
          </div>
        </motion.div>
      ))}

      {/* 🆕 Add Book card */}
      <motion.div
        key="add-book-tile"
        className="book-card add-book-tile"
        onClick={onAddBook}
        whileHover={{
          rotateY: 10,
          rotateX: -10,
          scale: 1.05,
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <div className="book-shine"></div>
        <div className="placeholder-inner">
          <div className="plus">＋</div>
          <div className="placeholder-text">Add Book</div>
        </div>
      </motion.div>

      {/* Render remaining empty slots */}
      {Array.from({ length: emptySlots > 0 ? emptySlots - 1 : 0 }).map((_, index) => (
        <motion.div
          key={`empty-${index}`}
          className="book-card book-placeholder"
          onClick={() => onEmptySlotClick(index)}
          whileHover={{
            rotateY: 10,
            rotateX: -20,
            scale: 1.05,
            boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div className="book-shine"></div>
          <div className="placeholder-inner">
            <div className="plus">＋</div>
            <div className="placeholder-text">Empty Slot</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// 🧠 MAIN BookMaker
export default function BookMaker({ books = [], setBooks, setSidebarOpen }) {
  const [activeBook, setActiveBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [addingBook, setAddingBook] = useState(false); // ✅ renamed and simpler
  const [loading, setLoading] = useState(true);

  // whenever you need to close the sidebar:
  const handleSomething = () => {
    setSidebarOpen(false);
  };


  // Load books from IndexedDB
  useEffect(() => {
    async function loadBooks() {
      try {
        const savedBooks = await getBooks();
        setBooks(savedBooks || []);
      } catch (err) {
        console.error("Failed to load books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [setBooks]);

  // Save book (for editing)
  const handleSaveBook = async (updatedBook) => {
    const newBooks = books.map((b) => (b && b.id === updatedBook.id ? updatedBook : b));
    setBooks(newBooks);
    await saveBooks(newBooks);
    setReadingBook(null);
    setActiveBook(updatedBook);
  };

  // Delete book
  const handleDeleteBook = async (bookId) => {
    const newBooks = books.filter((b) => b && b.id !== bookId);
    setBooks(newBooks);
    await deleteBook(bookId);
    setActiveBook(null);
    setReadingBook(null);
  };

  // Add new book
  const handleAddBook = async () => {
    const newBook = {
      id: Date.now(),
      title: "New Book",
      author: "Unknown",
      genre: "None",
      coverColor: "#88c0d0",
      chapters: [{ text: "", image: "" }],
      tags: {},
    };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
    setReadingBook(newBook);
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="bookmaker-container">

      {/* 🪶 Floating Add Button */}
      <button className="add-book-btn" onClick={() => setAddingBook(true)}>
          ＋ Add Book
        </button>

      <AnimatePresence mode="wait">
        {readingBook ? (
          <ReadYourBook
            key={readingBook.id}
            book={readingBook}
            onClose={() => {

              setReadingBook(null)}}
            startChapter={readingBook.startChapter || 1}
            onSaveBook={handleSaveBook}
          />
        ) : activeBook ? (
          <BookReader
            key={activeBook.id}
            book={activeBook}
            onClose={() => setActiveBook(null)}
            onStartReading={(book) => {
            setReadingBook(book)
          
          }}
          />
        ) : (
          <BookShelf
              key="bookshelf"
              books={books}
              onOpen={setActiveBook}
              onEdit={(book) => setEditingBook(book)}
              onDelete={handleDeleteBook}
              onAddBook={() => setAddingBook(true)} // ✅ the new "Add Book" tile
            />

        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingBook && (
          <EditBookPanel
            key={editingBook.id}
            book={editingBook}
            onUpdateBook={handleSaveBook}
            onClose={() => setEditingBook(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addingBook && (
          <AddBookPanel
            key="add-book"
            onAddBook={async (newBook,) => {  // ✅ renamed from onSave → onAddBook
              const updatedBooks = [...books, newBook];
              setBooks(updatedBooks);
              await saveBooks(updatedBooks);
              setAddingBook(false);
            }}
            onClose={() => setAddingBook(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
