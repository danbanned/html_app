import { createRoot } from 'react-dom/client';
import MainPage from './Navigation.jsx';
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

// 🪄 Wrap your entire app in the provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainPage />
    </QueryClientProvider>
  </React.StrictMode>
);