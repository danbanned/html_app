// server/routes/chatRouter.js
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🚀 ChatRouter running with dual AI modes");

router.post("/", async (req, res) => {
  try {
    const { messages, bookContext, mode = "tagsAndDescription" } = req.body;
    const { title, genre, description, text, chapter } = bookContext || {};

    let prompt = "";

    // 🎯 Decide which AI mode to run
    switch (mode) {
      case "storyContinuation":
        prompt = `
You are a creative writing assistant continuing a story.

Book Title: "${title || "Untitled"}"
Genre: "${genre || "Fiction"}"
Chapter: ${chapter || 1}

Story so far:
${text || "No previous text provided."}

You are a creative writing assistant helping a user write a book.
Always stay consistent with the story's title, genre, and tone.
Continue the story from the provided text naturally and creatively.
`;
        break;

      case "tagsAndDescription":
      default:
        prompt = `
You are a creative story assistant.
Based on the following book info, generate a short book description and categorized tags.

Book Info:
Title: "${title || "Untitled"}"
Genre: "${genre || "Fiction"}"
Description: "${description || ""}"

Return ONLY valid JSON in this format:
{
  "description": "A 2–3 sentence creative summary of the book.",
  "tags": {
    "mood": ["Whimsical", "Enchanting", "Reflective"],
    "scenes": ["Magical Realism", "Urban Fantasia"],
    "themes": ["Self-Discovery", "Connection"],
    "setting": ["Adventure", "Imagination"],
    "connections": ["Fans of Fantasy"]
  }
}
Only return valid JSON — no extra commentary.
        `;
        break;
    }

    // 🧠 Call the OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative assistant for writers." },
        { role: "user", content: prompt },
        ...(messages || []),
      ],
      temperature: 0.8,
    });

    const aiText = response.choices?.[0]?.message?.content?.trim() || "";
    console.log("🧠 Raw AI output:", aiText);

    if (!aiText) {
      return res.status(500).json({ error: "AI returned an empty response." });
    }

    // ✨ Handle story continuation mode
    if (mode === "storyContinuation") {
      return res.json({ story: aiText });
    }

    // 🧩 Parse the JSON output for tags & description
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.warn("⚠️ AI did not return valid JSON. Using fallback.");
      parsed = {
        description: aiText || "No description generated.",
        tags: {
          mood: ["mystical"],
          scenes: ["intro"],
          themes: ["courage"],
          setting: ["friendship"],
          connections: ["fantasy readers"],
        },
      };
    }

    // 🎨 Assign pastel colors for UI
    const generateTagColor = (tagName) => {
      let hash = 0;
      for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 70%, 75%)`;
    };

    const colorizedTags = {};
    for (const [category, list] of Object.entries(parsed.tags || {})) {
      colorizedTags[category] = list.map((t) => ({
        name: typeof t === "string" ? t : t.name,
        color: generateTagColor(typeof t === "string" ? t : t.name),
      }));
    }

    // ✅ Return clean structured data
    res.json({
      description: parsed.description,
      tags: colorizedTags,
    });
  } catch (error) {
    console.error("❌ AI request failed:", error);
    res.status(500).json({ error: "AI request failed." });
  }
});

export default router;
