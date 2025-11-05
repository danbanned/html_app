import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

/**
 * 🧠 useStoryCoach — handles AI chat, advice, and image concept generation
 */
export function useStoryCoach(initialBook = null) {
  const [book, setBook] = useState(initialBook);
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [latestResponse, setLatestResponse] = useState({
    description: "",
    imagePrompt: "",
  });

  // 🌍 Use dynamic backend URL for flexibility (local or deployed)
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ✅ Define mutation for API call
  const storyCoachMutation = useMutation({
    mutationFn: async (payload) => {
      console.log("📤 Sending payload to StoryCoach:", payload);

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("❌ Failed to connect to AI backend");
      const aiResponse = await res.json();

      console.log("🤖 StoryCoach response:", aiResponse);
      return aiResponse;
    },
  });

  // 👋 Greet the user when a new book is selected
  useEffect(() => {
    if (!book) return;

    setMessages([
      {
        role: "assistant",
        content: `👋 Hi! I'm your AI Story Coach.\n\nYour story *${book.title}* sounds fascinating! Tell me what you'd like help with, or say "start".`,
      },
    ]);
    setImages([]);
    setLatestResponse({ description: "", imagePrompt: "" });
  }, [book]);

  // ✉️ sendMessage — handles both text & object input
  const sendMessage = async (input) => {
    if (!input) return;

    setIsThinking(true);
    let payload;
    let appendedUserMessage = null;

    // ✏️ Case 1: user sends a text
    if (typeof input === "string") {
      appendedUserMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, appendedUserMessage]);

      payload = {
        mode: "storyCoach",
        messages: [...messages, appendedUserMessage],
        bookContext: {
          title: book?.title || "Untitled",
          description: book?.description || "",
          genre: book?.genre || "General",
        },
      };
    }
    // 📖 Case 2: user sets a new book
    else if (typeof input === "object" && input.title && !input.mode) {
      setBook(input);

      payload = {
        mode: "storyCoach",
        messages: [
          { role: "user", content: `New story: ${input.title}` },
          { role: "user", content: input.description || "No description provided." },
        ],
        bookContext: input,
      };
    }
    // 🧩 Case 3: full custom payload
    else if (typeof input === "object") {
      payload = input;
    } else {
      setIsThinking(false);
      return;
    }

    try {
      const aiResponse = await storyCoachMutation.mutateAsync(payload);

      // Normalize text response
      const assistantText =
        aiResponse?.reply ||
        aiResponse?.content ||
        aiResponse?.description ||
        aiResponse?.text ||
        "🤔 I didn’t get a clear response. Try again?";

      // Add assistant reply to chat
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);

      // Generate unique image URLs
      let newImages = [];
      if (Array.isArray(aiResponse?.images) && aiResponse.images.length > 0) {
        newImages = aiResponse.images.map(
          (prompt) =>
            `https://image.pollinations.ai/prompt/${encodeURIComponent(
              prompt
            )}?seed=${Date.now()}`
        );
      } else if (aiResponse?.imagePrompt) {
        newImages = [
          `https://image.pollinations.ai/prompt/${encodeURIComponent(
            aiResponse.imagePrompt
          )}?seed=${Date.now()}`,
        ];
      }

      if (newImages.length > 0) setImages((prev) => [...prev, ...newImages]);

      // Update latestResponse
      setLatestResponse({
        description: assistantText,
        imagePrompt: aiResponse?.imagePrompt || "",
      });

      return aiResponse;
    } catch (err) {
      console.error("StoryCoach error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I couldn't reach the AI. Try again." },
      ]);
      throw err;
    } finally {
      setIsThinking(false);
    }
  };

  return {
    messages,
    sendMessage,
    isThinking,
    images,
    setBook,
    latestResponse,
  };
}
