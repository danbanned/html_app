import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AddBookPanel.css"; // Reuse AddBookPanel styling
import { useChatCompletion } from "../hooks/useChatCompletion";
import "../styles/EditBookPanel.css"

export default function EditBookPanel({ book, onUpdateBook, onClose }) {
  if (!book) return null; // safety guard

  // Prefill existing book data
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [genre, setGenre] = useState(book.genre || "");
  const [description, setDescription] = useState(book.description || "");
  const [coverImage, setCoverImage] = useState(book.coverImage || "");
  const [coverColor, setCoverColor] = useState(book.coverColor || "#4a90e2");
  const chat = useChatCompletion();
  const [isShowScroll, setShowScroll] = useState(false);

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
  const [isGenerating, setIsGenerating] = useState(false);

  const TITLE_LIMIT = 20;
  const AUTHOR_LIMIT = 15;
  const GENRE_LIMIT = 12;

  // 🎨 Generate consistent pastel color from tag text
  const generateTagColor = (tagName) => {
    let hash = 0;
    for (let letter = 0; letter < tagName.length; letter++)
      hash = tagName.charCodeAt(letter) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 75%)`;
  };

  // 🖼️ Handle file upload for cover
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddPremadeImage = () => {
  const premadeImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book3.jpg",
    "/images/book4.jpg",
    "/images/book5.jpg",
    "/images/book6.jpg",
    "/images/book7.jpg",
    "/images/book8.jpg",
    "/images/book9.jpg",
    "/images/book10.jpg",
  ];
  const random = Math.floor(Math.random() * premadeImages.length);
  setCoverImage(premadeImages[random]);
};

  // ➕ Add a tag (manual or AI)
  const addTag = (aiTag) => {
  const tagName =
    typeof aiTag === "string"
      ? aiTag.trim()
      : aiTag?.name?.trim?.() || currentTag.trim();

  if (!tagName) return;

  const color = generateTagColor(tagName);

  const newTag = {
    name: tagName,
    color,
  };

  setTags((prev) => ({
    ...prev,
    //it wants a list 
    [currentCategory]: [
      //it wants the current catagory so it can find its value and add a newtag 
      ...(prev[currentCategory] || []),
      newTag,
    ],
  }));

  setCurrentTag("");
};


  // ❌ Remove a tag
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

      const data = await mutateAsync(payload);
      console.log("✅ AI response:", data.tags);

      if (data.description) setDescription(data.description);

      if (data.tags) {

        // Go through AI tags and use addTag for each one
        setTags(data.tags)
        console.log(tags)
      }
    } catch (err) {
      console.error("❌ AI generation failed:", err);
      alert("AI generation failed. Check server logs.");
    } finally {
      setIsGenerating(false);
    }
  };



  // 💾 Save edited book actually updates it
  const Submitmybookafteriaddanewoneoreditone = () => {
    if (!title.trim()) return alert("⚠️ Please enter a title!");
    if (!author.trim()) return alert("⚠️ Please enter an author name!");
    if (!genre.trim()) return alert("⚠️ Please enter a genre!");

    const updatedBook = {
      ...book,
      title,
      author,
      genre,
      description,
      coverImage,
      coverColor,
      tags,
    };

    onUpdateBook(updatedBook);
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

        {/* --- BASIC FIELDS --- */}
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

        {/* --- TAG SYSTEM --- */}
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

        {/* --- COVER --- */}
        <div className="field">
          <button onClick={handleAddPremadeImage}>🎨 Add Premade Image</button>
          <label>Cover Image</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Paste image URL"
          />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>

        <div className="field">
          <label>Cover Color</label>
          <input
            type="color"
            value={coverColor}
            onChange={(e) => setCoverColor(e.target.value)}
          />
        </div>

        <div className="scroll-wrapper">
          {!isShowScroll ? (
            <button className="show-btn" onClick={() => setShowScroll(true)}>
              Show Books
            </button>
                ) : (
            <div className="scroll-container">
              <div className="scroll-track">
                {/* First set of images */}
                <img src="/scrollbook1.jpg" alt="Scroll Book 1" />
                <img src="/public/scrollbook2.jpg" alt="Scroll Book 2" />
                {/* Duplicate set for smooth infinite loop */}
                <img src="/scrollbook1.jpg" alt="Scroll Book 1" />
                <img src="/scrollbook2.jpg" alt="Scroll Book 2" />
              </div>
            </div>
           )}
    </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="buttons">
          <button onClick={Submitmybookafteriaddanewoneoreditone}>Save Changes</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button onClick={handleAIAssist} disabled={isGenerating} className="ai-button">
            {isGenerating ? "✨ Generating..." : "🤖 AI Assist"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
