import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AddBookPanel.css"; // Reuse AddBookPanel styling
import { useChatCompletion } from "../hooks/useChatCompletion";
import "../styles/EditBookPanel.css";

export default function EditBookPanel({ book, onUpdateBook, onClose }) {
  if (!book) return null;

  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [genre, setGenre] = useState(book.genre || "");
  const [description, setDescription] = useState(book.description || "");
  const [coverImage, setCoverImage] = useState(book.coverImage || "");
  const [coverColor, setCoverColor] = useState(book.coverColor || "#4a90e2");
  const [tags, setTags] = useState(
    book.tags || {
      characters: [],
      scenes: [],
      setting: [],
      time: [],
      mood: [],
      connections: [],
    }
  );
  const [currentCategory, setCurrentCategory] = useState("characters");
  const [currentTag, setCurrentTag] = useState("");
  const [isShowScroll, setShowScroll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const chat = useChatCompletion();

  const TITLE_LIMIT = 20;
  const AUTHOR_LIMIT = 15;
  const GENRE_LIMIT = 12;

  // Generate pastel color for tags
  const generateTagColor = (tagName) => {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++)
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 75%)`;
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Infinite random Picsum image
  const handleAddPremadeImage = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1000); // random 0-999
      const url = `https://picsum.photos/id/${randomId}/400/300`;

      // Optional: ensure image exists
      const res = await fetch(url);
      if (!res.ok) return handleAddPremadeImage();

      setCoverImage(url);
    } catch (err) {
      console.error("Failed to fetch random image:", err);
    }
  };

  // Add a tag
  const addTag = (aiTag) => {
    const tagName =
      typeof aiTag === "string"
        ? aiTag.trim()
        : aiTag?.name?.trim?.() || currentTag.trim();
    if (!tagName) return;

    const color = generateTagColor(tagName);

    const newTag = { name: tagName, color };

    setTags((prev) => ({
      ...prev,
      [currentCategory]: [...(prev[currentCategory] || []), newTag],
    }));

    setCurrentTag("");
  };

  const removeTag = (category, tagName) => {
    setTags((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t.name !== tagName),
    }));
  };

  // AI assist for description and tags
  const handleAIAssist = async () => {
    if (!title && !genre && !description) {
      alert("Please add at least a title or genre before using AI assist.");
      return;
    }

    setIsGenerating(true);

    try {
      const { mutateAsync } = chat;
      if (!mutateAsync) throw new Error("Chat API not initialized");

      const payload = {
        bookContext: {
          title: book?.title || title || "Untitled Book",
          genre: book?.genre || genre || "Fantasy",
          author: book?.author || author || "Unknown Author",
          description: description || "",
        },
        messages: [
          {
            role: "user",
            content: `Write a creative description and generate tags for "${book?.title || title}".`,
          },
        ],
      };
      console.log(chat)

      const data = await mutateAsync(payload);

      if (data.description) setDescription(data.description);
      if (data.tags) setTags(data.tags);
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI generation failed. Check server logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save edited book
  const submitBook = () => {
    if (!title.trim()) return alert("Please enter a title!");
    if (!author.trim()) return alert("Please enter an author name!");
    if (!genre.trim()) return alert("Please enter a genre!");

    onUpdateBook({
      ...book,
      title,
      author,
      genre,
      description,
      coverImage,
      coverColor,
      tags,
    });

    onClose();
  };

  useEffect(() => {
    setTitle(book.title || "");
    setAuthor(book.author || "");
    setGenre(book.genre || "");
    setDescription(book.description || "");
    setCoverImage(book.coverImage || "");
    setCoverColor(book.coverColor || "#4a90e2");
    setTags(
      book.tags || {
        characters: [],
        scenes: [],
        setting: [],
        time: [],
        mood: [],
        connections: [],
      }
    );
  }, [book]);

  return (
    <motion.div
      className="addbook-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="addbook-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
        <h2>Edit Book 📚</h2>

        {/* BASIC FIELDS */}
        <div className="field">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_LIMIT}
            placeholder="Enter book title"
          />
        </div>

        <div className="field">
          <label>Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={AUTHOR_LIMIT}
            placeholder="Enter author name"
          />
        </div>

        <div className="field">
          <label>Genre</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            maxLength={GENRE_LIMIT}
            placeholder="Enter genre"
          />
        </div>

        <div className="field description">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short book description"
          />
        </div>

        {/* TAG SYSTEM */}
        <div className="field">
          <label>Tags (auto-colored)</label>
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
          >
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
                    <span
                      key={tag.name}
                      className="tag-item"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                      <button onClick={() => removeTag(category, tag.name)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COVER IMAGE */}
        <div className="field">
          <button onClick={handleAddPremadeImage}>🎨 Random Premade Image</button>
          <label>Cover Image</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Paste image URL"
          />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {coverImage && (
            <div className="cover-preview">
              <img src={coverImage} alt="Selected Cover" />
            </div>
          )}
        </div>

        <div className="field">
          <label>Cover Color</label>
          <input
            type="color"
            value={coverColor}
            onChange={(e) => setCoverColor(e.target.value)}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="buttons">
          <button onClick={submitBook}>Save Changes</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button onClick={handleAIAssist} disabled={isGenerating} className="ai-button">
            {isGenerating ? "✨ Generating..." : "🤖 AI Assist"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
