// Import express to define routes
import express from "express";
// Import fetch (Node 18+ has global fetch, but this ensures it works everywhere)
import fetch from "node-fetch";

// Create a new router instance for all chat-related endpoints
const router = express.Router();

// Define POST endpoint at /api/chat
router.post("/api/chat", async (req, res) => {
  // Extract data sent from frontend
  const { messages, bookContext } = req.body;

  // Validate: messages must be an array of chat message objects
  if (!Array.isArray(messages)) {
    // If not valid, return HTTP 400 (Bad Request)
    return res.status(400).json({ error: "Invalid payload: messages must be an array" });
  }

  try {
    // 👇 Build a request to OpenAI’s chat completions endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completaions", {
      method: "POST", // POST request
      headers: {
        "Content-Type": "application/json", // body is JSON
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // secret key from .env
      },
      body: JSON.stringify({
        // Choose a lightweight, fast model
        model: "gpt-4o-mini",

        // Combine all chat messages:
        // 1. A system message defining assistant’s behavior
        // 2. The user messages from frontend
        // 3. Optionally include context about the current book
        messages: [
          {
            role: "system",
            content: "You are a helpful book assistant. Be concise and helpful.",
          },
          ...messages,
          {
            role: "system",
            content: JSON.stringify(bookContext ?? {}), // safe fallback if undefined
          },
        ],

        // Control creativity & output length
        temperature: 0.6, // 0 = factual, 1 = creative
        max_tokens: 600, // limit response length
      }),
    });

    // Handle if OpenAI API responds with error
    if (!response.ok) {
      const errText = await response.text(); // read error details
      console.error("OpenAI error:", response.status, errText); // log for debugging
      return res.status(502).json({ error: "Upstream AI error" }); // send 502 back to client
    }

    // Parse JSON returned from OpenAI
    const data = await response.json();

    // Extract just the text message from OpenAI's structured response
    const reply = data.choices?.[0]?.message?.content ?? "";

    // Send the reply back to frontend as JSON
    return res.json({ reply });
  } catch (error) {
    // Catch network issues, API key errors, etc.
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Assistant unavailable" });
  }
});

// Export this router so server.js can mount it
export default router;
