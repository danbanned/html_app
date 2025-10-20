// src/hooks/useChatCompletion.js
import { useMutation } from "@tanstack/react-query";

export function useChatCompletion() {
  return useMutation({
    mutationFn: async (payload) => {
      // payload: { messages: [{role, content}], bookContext?: {} }
      const response = await fetch("http://localhost:5000/api/chat", {
        //our backend server 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        //data we recieve from ai 
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Assistant unavailable");
      }
      return response.json(); // { reply }
    },
  });
}

//Would you like me to show you how to modify chatRouter.js 
// so it returns structured data — for example { description, tags }
//  — instead of just { reply }?
//That way, your AI Assist button can directly fill 
// in both the book description and tags automatically.