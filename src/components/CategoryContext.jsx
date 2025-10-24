// src/components/CategoryContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create context
const CategoryContext = createContext();

// Create provider
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState({
    theme: [],
    characters: [],
    scene: [],
    setting: [],
  });

  const addCategoryItem = (category, item) => {
    setCategories((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), item],
    }));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategoryItem }}>
      {children}
    </CategoryContext.Provider>
  );
}

// Custom hook to use context
export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
