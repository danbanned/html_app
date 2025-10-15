import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/ImagineDesign.css"; // import the CSS file
import BookMaker from "../components/BookMaker.jsx";

export default function ImagineDesign() {
  // Lifted state for all books
  const [books, setBooks] = useState([]);

  // Function to handle adding a new book
  const handleAddClick = () => {
    const title = prompt("Title") || "Untitled Book";
    const author = prompt("Author") || "Unknown Author";
    const genre = prompt("Genre") || "Unknown Genre";
    const description = prompt("Description") || "";
    const coverImage = prompt("Cover image URL (optional)") || "";
    const coverColor = prompt("Cover color (optional)") || "#4a90e2"; // default blue
    

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

    // Add the new book to the state
    setBooks([...books, newBook]);
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
        <button onClick={handleAddClick}>Add Book</button>
        <h2>📂 Sidebar</h2>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="main-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Pass books state and setter to BookMaker */}
        <BookMaker books={books} setBooks={setBooks} />
      </motion.main>
    </div>
  );
}
