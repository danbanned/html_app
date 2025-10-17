import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AddBookPanel.css";

export default function AddBookPanel({ existingBook = null, slotIndex, onAddBook, onClose }) {
  // Prefill fields if editing
  const [title, setTitle] = useState(existingBook?.title || "");
  const [author, setAuthor] = useState(existingBook?.author || "");
  const [genre, setGenre] = useState(existingBook?.genre || "");
  const [description, setDescription] = useState(existingBook?.description || "");
  const [coverImage, setCoverImage] = useState(existingBook?.coverImage || "");
  const [coverColor, setCoverColor] = useState(existingBook?.coverColor || "#4a90e2");

  const [tags, setTags] = useState(existingBook?.tags || {
    characters: [],
    scenes: [],
    setting: [],
    time: [],
    mood: [],
    connections: [],
  });

  const [currentCategory, setCurrentCategory] = useState("characters");
  const [currentTag, setCurrentTag] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const TITLE_LIMIT = 20;
  const AUTHOR_LIMIT = 15;
  const GENRE_LIMIT = 12;

  // Generate consistent pastel color from text
  const generateTagColor = (tagName) => {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 75%)`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    const color = generateTagColor(currentTag.trim());
    const newTag = { name: currentTag.trim(), color };
    setTags((prev) => ({
      ...prev,
      [currentCategory]: [...prev[currentCategory], newTag],
    }));
    setCurrentTag("");
  };

  const removeTag = (category, tagName) => {
    setTags((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t.name !== tagName),
    }));
  };

  // 🧠 AI Integration: generate suggestions for description and tags
  const handleAIAssist = async () => {
    if (!title && !genre && !description) {
      alert("Please add at least a title or genre before using AI assist.");
      return;
    }

    setIsGenerating(true);
    try {
      // --- mock AI call (replace with your actual integration later)
      const aiResponse = await fakeAIResponse({
        title,
        genre,
        description,
      });

      if (aiResponse.description) setDescription(aiResponse.description);
      if (aiResponse.tags) setTags(aiResponse.tags);

      alert("✨ AI has added suggestions!");
    } catch (error) {
      console.error("AI generation failed:", error);
      alert("⚠️ AI generation failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Temporary placeholder for AI — replace with your real API call
  const fakeAIResponse = async ({ title, genre }) => {
    await new Promise((res) => setTimeout(res, 1500)); // simulate delay
    return {
      description: `A thrilling ${genre} story about "${title}" that explores imagination and mystery.`,
      tags: {
        ...tags,
        mood: [...tags.mood, { name: "mystical", color: generateTagColor("mystical") }],
        scenes: [...tags.scenes, { name: "intro", color: generateTagColor("intro") }],
      },
    };
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert("⚠️ Please enter a title!");
    if (!author.trim()) return alert("⚠️ Please enter an author name!");
    if (!genre.trim()) return alert("⚠️ Please enter a genre!");

    const newBook = {
      id: existingBook?.id ?? Date.now(), // preserve id if editing
      title,
      author,
      genre,
      description,
      coverImage,
      coverColor,
      chapters: existingBook?.chapters || [],
      tags,
    };

    onAddBook(newBook, slotIndex);
  };

  // Auto-update state if existingBook changes
  useEffect(() => {
    setTitle(existingBook?.title || "");
    setAuthor(existingBook?.author || "");
    setGenre(existingBook?.genre || "");
    setDescription(existingBook?.description || "");
    setCoverImage(existingBook?.coverImage || "");
    setCoverColor(existingBook?.coverColor || "#4a90e2");
    setTags(existingBook?.tags || {
      characters: [],
      scenes: [],
      setting: [],
      time: [],
      mood: [],
      connections: [],
    });
  }, [existingBook]);

  return (
    <motion.div className="addbook-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="addbook-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 20 }}>
        <h2>{existingBook ? "Edit Book 📚" : "Add a New Book 📚"}</h2>

        {/* Basic Fields */}
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter book title" maxLength={TITLE_LIMIT} />
        </div>

        <div className="field">
          <label>Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name" maxLength={AUTHOR_LIMIT} />
        </div>

        <div className="field">
          <label>Genre</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Enter genre" maxLength={GENRE_LIMIT} />
        </div>

        <div className="field description">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short book description" />
        </div>

        {/* Tags */}
        <div className="field">
          <label>Tags (auto-colored)</label>
          <select value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)}>
            <option value="characters">Characters</option>
            <option value="scenes">Scenes</option>
            <option value="setting">Setting</option>
            <option value="time">Time</option>
            <option value="mood">Mood</option>
            <option value="connections">Connections</option>
          </select>

          <div className="tag-input">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder={`Add ${currentCategory} tag`}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <button onClick={addTag}>Add</button>
          </div>

          <div className="tag-display">
            {Object.entries(tags).map(([category, list]) => (
              <div key={category} className="tag-category">
                <strong>{category.toUpperCase()}:</strong>
                <div className="tag-list">
                  {list.map((tag) => (
                    <span key={tag.name} className="tag-item" style={{ backgroundColor: tag.color }}>
                      {tag.name}
                      <button onClick={() => removeTag(category, tag.name)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover + Color */}
        <div className="field">
          <label>Cover Image</label>
          <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Paste image URL" />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>

        <div className="field">
          <label>Cover Color</label>
          <input type="color" value={coverColor} onChange={(e) => setCoverColor(e.target.value)} />
        </div>

        <div className="buttons">
          <button onClick={handleSubmit}>{existingBook ? "Save Changes" : "Add Book"}</button>
          <button onClick={onClose} className="cancel">Cancel</button>
          <button onClick={handleAIAssist} disabled={isGenerating} className="ai-button">
            {isGenerating ? "✨ Generating..." : "🤖 AI Assist"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
