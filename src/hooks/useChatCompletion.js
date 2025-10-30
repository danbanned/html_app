import { useMutation } from "@tanstack/react-query";

export function useChatCompletion() {
  return useMutation({
    mutationFn: async (payload) => {
      /**
       * payload should look like:
       * {
       *   mode: "tagsAndDescription" | "storyContinuation",
       *   messages?: [{ role, content }],
       *   bookContext?: {
       *     title,
       *     genre,
       *     description?,
       *     text?,        // for storyContinuation
       *     chapter?,     // for storyContinuation
       *   }
       * }
       */

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Assistant unavailable");
      }

      const data = await response.json();

      // 🧠 Automatically handle both AI modes
      if (payload.mode === "storyContinuation") {
        return { type: "story", content: data.story };
      }

      if (payload.mode === "suggestNextChapter") {
        return {
          type: "story",
          content: data.suggestion,
          summary: data.summary || "",
        };
      }

      // Default: tags + description mode
      return {
        type: "metadata",
        description: data.description,
        tags: data.tags,
      };
    },
  });
}
