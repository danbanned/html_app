import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/BookMaker.css";
import ReadYourBook from "./ReadYourBook"; // ✅ Updated import
import EditBookPanel from "./EditBookPanel.jsx";



// 📚 BOOK SHELF
function BookShelf({ books, onOpen, onEmptySlotClick, onEdit, onDelete }) {
  return (
    <div className="book-shelf">
      {books.map((book, index) =>
        book ? (
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
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}
                title="Edit Book"
              >
                ✎
              </button>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book.id);
                }}
                title="Delete Book"
              >
                🗑
              </button>
            </div>

            <div className="book-details" onClick={() => onOpen(book)}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.genre}</p>
              {book.chapters && book.chapters.length > 0 && (
                <span className="chapter-count">📖 {book.chapters.length} Chapters</span>
              )}
            </div>
          </motion.div>
        ) : (
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
              <div className="placeholder-text">Add a book</div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}

// 🌈 BOOK READER PREVIEW
function BookReader({ book, onClose, onStartReading }) {
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
            //uses object entry which turns a object into a list
            //loops through book tags
              list.length > 0 && (
                //checks to see if the tags exceed 0 and returns
                //1. key has its own catory foir every item 
                //2. that catogory/tag gets turned uppercase 
                //3. we loop through the list of [tags] of said [catagory]
                //4 give them nice backgrounds 
                <div key={category} className="tag-block">
                  <h5>{category.toUpperCase()}</h5>
                  <div className="tag-bubbles">
                    {list.map((tag) => (
                      <span key={tag.name} className="bubble" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="reader-buttons">
          <button className="continue-btn" onClick={() => onStartReading(book)}>📖 Start Reading</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 🧠 MAIN BookMaker
export default function BookMaker({ books, setBooks }) {
  const [activeBook, setActiveBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // Load books from localStorage
  //useeffcect constantly keeps it updated 
  useEffect(() => {
    const savedBooks = localStorage.getItem("imagine_books_v1");
    if (savedBooks) setBooks(JSON.parse(savedBooks));
  }, [setBooks]);

  // Save book (for editing in ReadYourBook)
  const handleSaveBook = (updatedBook) => {
    //handlesavebook is our function call while updatedbook saves the data \
    //it returns setbooks, 
    setBooks((prev) => {
      const newBooks = prev.map((b) => (b && b.id === updatedBook.id ? updatedBook : b));
      localStorage.setItem("imagine_books_v1", JSON.stringify(newBooks));
      return newBooks;
    });
    setReadingBook(null);
    setActiveBook(updatedBook);
  };

  // Delete book
  const handleDeleteBook = (bookId) => {
    setBooks((prev) => {
      const newBooks = prev.filter((b) => b && b.id !== bookId);
      localStorage.setItem("imagine_books_v1", JSON.stringify(newBooks));
      return newBooks;
    });
    setActiveBook(null);
    setReadingBook(null);
  };

  // Add new book
  const handleAddBook = () => {
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
    localStorage.setItem("imagine_books_v1", JSON.stringify(updatedBooks));
    setReadingBook(newBook);
  };

//everything under are your function calls
// they are conditioned by ? which checks to see if the function exist 
//befor callinng
//they all have there own functions/button calls
//and classnames 
//Only one of these components is rendered at a time.
//Each one only runs if its required data exists.
//so each of these check to see if 

  return (
    <div className="bookmaker-container">
      <AnimatePresence mode="wait">
        {readingBook ? (
          
          <ReadYourBook
            key={readingBook.id}
            book={readingBook}
            onClose={() => setReadingBook(null)}
            startChapter={readingBook.startChapter || 1}
            onSaveBook={handleSaveBook}
          />
        ) : activeBook ? (
          //leads our uses to the page when they first click on a book 
          //from all 9000 of the other books 
          <BookReader
            key={activeBook.id}// looks for actuvebook id 
            book={activeBook} //the current book 
            onClose={() => setActiveBook(null)} //closes book
            onStartReading={(book) => setReadingBook(book)} //redirects users to the inside of there book
          />
        ) : (
          <BookShelf
            key="bookshelf"
            books={books}
            onOpen={setActiveBook}
            onEmptySlotClick={handleAddBook}
            onEdit={(book) => setEditingBook(book)}
            onDelete={handleDeleteBook}
          />
        )
        
        
        }
        
      </AnimatePresence>
      
      <AnimatePresence>
      
        {editingBook && (//the lines below is where EditBookPanel gets its prefilled data
          //  const [editingBook, setEditingBook] = useState(null);
          //check to see if editingBook is true and returns evrything
          //seteditingbook is our updated version
          //&& conditional
          //else 
          <EditBookPanel
            book={editingBook}
            onUpdateBook={handleSaveBook}
            onClose={() => setEditingBook(null)}
            //we are sending this 
            // information directly to our editbookpanel 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
