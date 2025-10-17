// server/chatRouter.js
import express from "express";
import fetch from "node-fetch"; // or global fetch in node18+
const router = express.Router();

router.post("/api/chat", async (req, res) => {
  const { messages, bookContext } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid payload: messages must be an array" });
  }

  try {
    // Build OpenAI request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change if you prefer another model
        messages: [
          {
            role: "system",
            content: "You are a helpful book assistant. Be concise and helpful.",
          },
          ...messages,
          {
            role: "system",
            content: JSON.stringify(bookContext ?? {}),
          },
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return res.status(502).json({ error: "Upstream AI error" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return res.json({ reply });
  } catch (error) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Assistant unavailable" });
  }
});

export default router;
