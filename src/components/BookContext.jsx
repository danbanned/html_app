import { createContext, useContext, useEffect, useState } from "react";
import localforage from "localforage";

const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    localforage.getItem("slides_theme").then((storedBooks) => {
      setBooks(storedBooks || []);
      console.log("📚 Loaded books from storage:", storedBooks || []);
    });
  }, []);

  const addBook = async (book) => {
    setBooks((prev) => {
      const updated = [...prev, book];
      localforage.setItem("slides_theme", updated);
      console.log("✅ Book saved to storage:", updated);
      return updated;
    });
  };

  const updateBook = async (updatedBook) => {
    setBooks((prev) => {
      const updated = prev.map((b) =>
        b.id === updatedBook.id ? updatedBook : b
      );
      localforage.setItem("slides_theme", updated);
      return updated;
    });
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
