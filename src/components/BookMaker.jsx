import { useState } from "react";
import "../styles/BookMaker.css"; // Assuming you have some styles

// Placeholder components for BookShelf and BookReader
function BookShelf({ books, onOpen }) {
  return (
    <div className="book-shelf">
      {books.map((book) => (
        <div
          key={book.id}
          className="book-card"
          style={{ backgroundColor: book.coverColor }}
          onClick={() => onOpen(book)}
        >
          {book.coverImage && <img src={book.coverImage} alt={book.title} />}
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.genre}</p>
        </div>
      ))}
    </div>
  );
}

function BookReader({ book, onClose }) {
  return (
    <div className="book-reader">
      <button onClick={onClose}>Close</button>
      <h2>{book.title}</h2>
      <h4>{book.author}</h4>
      <p>{book.description}</p>
    </div>
  );
}

// Main exportable component
export default function BookMaker() {
  const [books, setBooks] = useState([]);
  const [activeBook, setActiveBook] = useState(null);

  // Function to add a new book
  const handleAddBook = () => {
    const title = prompt("Title") || "Untitled Book";
    const author = prompt("Author") || "Unknown Author";
    const genre = prompt("Genre") || "Unknown Genre";
    const description = prompt("Description") || "";
    const coverImage = prompt("Cover image URL (optional)") || "";
    const coverColor = prompt("Cover color (optional)") || "#3d81cf2d"; // default blue

    const newBook = {
      id: Date.now(),
      title,
      author,
      genre,
      description,
      coverImage,
      coverColor,
      chapters: [],
    };

    setBooks([...books, newBook]);
  };

  const openBook = (book) => {
    setActiveBook(book);
  };

  const closeBook = () => {
    setActiveBook(null);
  };

  return (
    <div>
      <button className="newbook" onClick={handleAddBook}>Add Book</button>
      {activeBook ? (
        <BookReader book={activeBook} onClose={closeBook} />
      ) : (
        <BookShelf books={books} onOpen={openBook} />
      )}
    </div>
  );
}
