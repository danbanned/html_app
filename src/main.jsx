import React from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./Navigation.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {CategoryProvider} from "../src/components/CategoryContext.jsx"
import { BookProvider } from "../src/components/BookContext.jsx";
import AddBookPanel from "./imagine-components/AddBookPanel.jsx";
import CategoryPage from "./storyboard-component/CategoryPage.jsx";
import { TutorialProvider } from "./components/TutorialContext.jsx";

// Create the query client instance
const queryClient = new QueryClient();

// Get your app's root DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render your app wrapped in both providers
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TutorialProvider>
        <BookProvider >
        <CategoryProvider>
        <MainPage />
        </CategoryProvider>
         </BookProvider>
         </TutorialProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
