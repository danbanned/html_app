import React from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./Navigation.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AIProvider } from "../src/storyboard-component/AIContext.jsx";
import {CategoryProvider} from "../src/components/CategoryContext.jsx"


// Create the query client instance
const queryClient = new QueryClient();

// Get your app's root DOM element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render your app wrapped in both providers
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AIProvider>
        <CategoryProvider>
        <MainPage />
        </CategoryProvider>
      </AIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
