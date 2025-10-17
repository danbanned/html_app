// src/hooks/useChatCompletion.js
import { useMutation } from "@tanstack/react-query";

export function useChatCompletion() {
  return useMutation({
    mutationFn: async (payload) => {
      // payload: { messages: [{role, content}], bookContext?: {} }
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Assistant unavailable");
      }
      return response.json(); // { reply }
    },
  });
}
