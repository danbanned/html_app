// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🚀 Lightweight Story AI server running...");

// === MAIN CHAT ENDPOINT ===
app.post("/api/chat", async (req, res) => {
  const {
    messages = [],
    bookContext = {},
    mode = "tagsAndDescription",
    userProfile = "",
    chatHistory = "",
  } = req.body;

  const {
    title = "Untitled",
    genre = "Fiction",
    description = "",
    text = "",
    chapter = "",
  } = bookContext;

  // 🧠 Ensure text fallback
  const storyText = text.trim() || "Once upon a time...";

  let prompt = "";

  switch (mode) {
    case "storyContinuation":
      prompt = `
Continue the story creatively while keeping tone and consistency.

Book: "${title}"
Genre: "${genre}"
Chapter: ${chapter}
Story so far:
${storyText}
`;
      break;

    case "contextualAssistant":
      prompt = `
You are a warm, reflective writing assistant.
Profile: ${userProfile}
Recent chat: ${chatHistory}

Book Info:
"${title}" — ${genre}
${description || "No description provided."}

Task:
- Respond with thoughtful writing advice.
- Ask meaningful questions.
- Occasionally include vivid imagery or ideas.
`;
      break;

    case "storyCoach":
      prompt = `
You are an imaginative story coach helping a writer refine their ideas.

Book: "${title}" (${genre})
Description: "${description || "No description provided."}"

Conversation so far:
${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}

Respond warmly and creatively to the latest message.
Include optional visual inspiration ideas.
`;
      break;

    default:
      prompt = `
Generate a JSON response with a 2–3 sentence creative summary and categorized tags.

Book: "${title}"
Genre: "${genre}"
Description: "${description || "No description provided."}"

Format:
{
  "description": "...",
  "tags": {
    "mood": [],
    "scenes": [],
    "themes": [],
    "setting": [],
    "connections": []
  }
}
`;
      break;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative assistant for storytellers." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const content =
  completion.choices?.[0]?.message?.content?.trim() ??
  "[No AI response — possibly empty prompt or token limit.]";

    console.log(`🧠 [${mode}] Response:`, content.slice(0, 150));

    // 🖼️ Safe imagePrompt
    const safeTitle = title || "Untitled";
    const safeDescription = description || "main scene";
    const imagePrompt =
      /image|illustration|scene|setting/i.test(content)
        ? `Illustration of a scene from "${safeTitle}" — ${safeDescription}`
        : null;

    // Mode-specific outputs
    if (["storyCoach", "contextualAssistant", "storyContinuation"].includes(mode)) {
      return res.json({ content, imagePrompt });
    }

    // Tag-based output
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { description: content, tags: {} };
    }

    const generateTagColor = (tag) => {
      let hash = 0;
      for (let i = 0; i < tag.length; i++)
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 70%, 75%)`;
    };

    const colorizedTags = {};
    for (const [key, list] of Object.entries(parsed.tags || {})) {
      colorizedTags[key] = (list || []).map((t) => ({
        name: t,
        color: generateTagColor(t),
      }));
    }

    res.json({
      description: parsed.description || "No description generated.",
      tags: colorizedTags,
      imagePrompt,
    });
  } catch (error) {
    console.error("❌ AI error:", error);
    res.status(500).json({ error: "AI unavailable" });
  }
});

// === HEALTH CHECK ===
app.get("/", (req, res) => res.send("✅ Lightweight AI backend running successfully"));

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server listening on port ${PORT}`)
);
