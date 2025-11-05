import { useMutation } from "@tanstack/react-query";

/**
 * 🧠 useChatCompletion
 * Handles communication with the backend AI service.
 * Automatically normalizes responses and provides clear fallbacks if the AI returns nothing.
 */
export function useChatCompletion() {
  // 🌍 Use deployment URL or local dev server
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return useMutation({
    mutationFn: async (payload) => {
      console.log("📤 Sending chat payload (useChatCompletion):", payload);

      try {
        const response = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Backend HTTP error:", text);
          throw new Error(text || "Assistant unavailable");
        }

        const data = await response.json();
        console.log("🤖 Raw AI response received:", data);

        // 🧩 Sanity check — detect totally empty or malformed responses
        if (!data || Object.keys(data).length === 0) {
          console.warn("⚠️ Backend returned an empty object — no AI content.");
          return {
            type: "error",
            content: "⚠️ AI returned no usable content.",
            imagePrompt: null,
            error: "Empty response from backend.",
          };
        }

        // 🧠 Normalize based on mode
        let content =
          data.content ||
          data.reply ||
          data.description ||
          data.text ||
          data.output ||
          null;

        // 🧩 Improve safety — detect AI fallback phrases
        if (
          !content ||
          content.trim().length === 0 ||
          /no response/i.test(content)
        ) {
          content =
            "🤔 The AI didn't respond with meaningful text. Try again or adjust your prompt.";
        }

        const normalized = {
          type: ["storyContinuation", "contextualAssistant", "storyCoach"].includes(
            payload.mode
          )
            ? "chat"
            : "metadata",
          content,
          description: data.description || "",
          tags: data.tags || [],
          imagePrompt:
            data.imagePrompt ||
            (payload.bookContext
              ? `Scene from "${payload.bookContext.title}" — ${
                  payload.bookContext.description || "No description"
                }`
              : null),
        };

        console.log("✅ Normalized AI output:", normalized);
        return normalized;
      } catch (err) {
        console.error("💥 AI request failed:", err);

        // 🩹 Graceful fallback
        return {
          type: "error",
          content:
            "⚠️ The AI assistant could not generate a response. Check your internet or server connection.",
          imagePrompt: null,
          error: err.message || "Unknown error",
        };
      }
    },
  });
}
