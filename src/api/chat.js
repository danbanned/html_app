// api/chat.js (serverless)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, bookContext } = req.body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Invalid payload" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful book assistant." },
          ...messages,
          { role: "system", content: JSON.stringify(bookContext ?? {}) },
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("OpenAI:", r.status, text);
      return res.status(502).json({ error: "Upstream AI error" });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Assistant unavailable" });
  }
}
