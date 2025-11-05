import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AddBookPanel.css";
import { useChatCompletion } from "../hooks/useChatCompletion";
import { FaInfoCircle } from "react-icons/fa";
import { useBooks } from "../components/BookContext";




export default function AddBookPanel({ existingBook = null, slotIndex, onAddBook, onClose }) {
  const [title, setTitle] = useState(existingBook?.title || "");
  const [author, setAuthor] = useState(existingBook?.author || "");
  const [genre, setGenre] = useState(existingBook?.genre || "");
  const [description, setDescription] = useState(existingBook?.description || "");
  const [coverImage, setCoverImage] = useState(existingBook?.coverImage || "");
  const [coverColor, setCoverColor] = useState(existingBook?.coverColor || "#4a90e2");
  const [showGuide, setShowGuide] = useState(false);



const { books, addBook } = useBooks();

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

  const chat = useChatCompletion();

  const TITLE_LIMIT = 20;
  const AUTHOR_LIMIT = 15;
  const GENRE_LIMIT = 12;

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
          title: existingBook?.title || title || "Untitled Book",
          genre: existingBook?.genre || genre || "Fantasy",
          author: existingBook?.author || author || "Unknown Author",
          description: description || "",
        },
        messages: [
          {
            role: "user",
            content: `Write a creative description and generate tags for "${existingBook?.title || title}".`,
          },
        ],
      };

      const data = await mutateAsync(payload);
      if (data.description) setDescription(data.description);
      if (data.tags) {
        // Replace the entire tag object safely
        setTags(data.tags);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI generation failed. Check server logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert("⚠️ Please enter a title!");
    if (!author.trim()) return alert("⚠️ Please enter an author name!");
    if (!genre.trim()) return alert("⚠️ Please enter a genre!");

    const newBook = {
      id: existingBook?.id ?? Date.now(),
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
    addBook(newBook);
    
  };

 useEffect(() => {
    console.log("📚 BookContext Updated:", books);
  }, [books]);

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
   <motion.div 
  className="addbook-overlay" 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  exit={{ opacity: 0 }}
>
  <motion.div 
    className="addbook-wrapper"  // ✅ new wrapper to hold both panels side by side
    initial={{ x: "100%" }} 
    animate={{ x: 0 }} 
    exit={{ x: "100%" }} 
    transition={{ type: "spring", damping: 20 }}
  >

    {/* LEFT: Main Add/Edit Book Panel */}
    <div className="addbook-panel">
      <div className="panel-header">
        <h2>{existingBook ? "Edit Book 📚" : "Add a New Book 📚"}</h2>
        <button className="info-btn" onClick={() => setShowGuide(!showGuide)}>
          <FaInfoCircle /> {showGuide ? "Hide Guide" : "Show Guide"}
        </button>
      </div>

        <div>
          <button
            onClick={() => addBook({ id: Date.now(), title: "Test Book" })}
          >
            ➕ Add Test Book
          </button>

          
        </div>

      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={TITLE_LIMIT} />
      </div>

      <div className="field">
        <label>Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={AUTHOR_LIMIT} />
      </div>

      <div className="field">
        <label>Genre</label>
        <input value={genre} onChange={(e) => setGenre(e.target.value)} maxLength={GENRE_LIMIT} />
      </div>

      <div className="field description">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* TAGS SECTION */}
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
                {list.map((tag, index) => (
                  <span
                    key={`${category}-${tag.name}-${index}`}
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

      {/* COVER */}
      <div className="field">
        <label>Cover Image</label>
        <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>

      <div className="field">
        <label>Cover Color</label>
        <input type="color" value={coverColor} onChange={(e) => setCoverColor(e.target.value)} />
      </div>

      <div className="buttons">
        <button onClick={handleSubmit}>{existingBook ? "Save Changes" : "Add Book"}</button>
        <button onClick={onClose} className="cancel">Cancel</button>
        <button className="edit-btn" onClick={handleAIAssist}>
          {isGenerating ? "✨ Generating..." : "🤖 AI Assist"}
        </button>
      </div>
    </div>

    {/* RIGHT: Info / Guide Panel */}
    {showGuide && (
      <motion.div
        className="guide-panel"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.4 }}
      >
        <h3>🧭 How to Create Your Book</h3>
        <ul>
          <li><strong>Title:</strong> Give your story a clear and memorable name.</li>
          <li><strong>Author:</strong> Add your name or pen name.</li>
          <li><strong>Genre:</strong> Helps categorize your story (e.g., Fantasy, Drama, Sci-Fi).</li>
          <li><strong>Description:</strong> A short summary that describes your book’s theme and premise.</li>
          <li><strong>Cover:</strong> Upload or design a book cover to personalize it.</li>
          <li><strong>Tags:</strong> Add keywords for characters, scenes, and more — these help the AI understand your story’s world.</li>
          <li><strong>AI Assist:</strong> Let AI generate book ideas, descriptions, and tags to inspire your creativity.</li>
        </ul>

        <h4>📖 How It Works</h4>
        <p>
          Once your book is created, it appears on your <strong>Imagine Design homepage</strong>.  
          You can open it anytime to read, edit, or expand it.  
          Each book connects to your <strong>Storyboard</strong>,  
          where you can draw and visualize your story scenes.
        </p>
      </motion.div>
    )}
  </motion.div>
</motion.div>
  );
}
