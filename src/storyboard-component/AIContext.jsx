import { createContext, useContext, useState } from "react";

const AIContext = createContext();

export function AIProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendToAI = async (userMessage) => {
    setIsLoading(true);

    // Add user's message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Example: fetch from your backend AI route
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const aiMessage = data.reply || "AI had no response.";

      // Add AI's response
      setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider value={{ messages, sendToAI, isLoading }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
