import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/CategoryPanel.module.css";
import { getBooks } from "../utils/indexedDB.js";


export default function CategoryPanelBase({
  mode = "add", // "add" | "edit"
  category,
  slide = null,
  onSave,
  onClose,
}) {
  // Determine if we’re editing a slide, stage, or substage
  const isStage = slide?.subStages !== undefined && !slide?.children;
  const isSubStage =
    slide && !slide?.children && !slide?.subStages && slide?.parentStageId;
  const isSlide = !isStage && !isSubStage;

  // 🧠 States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");

  // 🖼️ File upload for cover image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 🎨 Random premade image
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

  useEffect(() => {
  async function loadBooks() {
    try {
      const savedBooks = await getBooks();
      setBooks(savedBooks || []);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  }
  loadBooks();
}, []);

  // 🔁 Prefill fields if editing
  useEffect(() => {
    if (mode === "edit" && slide) {
      setTitle(slide.title || "");
      setDescription(slide.description || "");
      setImageUrl(slide.imageUrl || "");
      setCoverImage(slide.coverImage || "");
    }
  }, [mode, slide]);

  // 💾 Save action
  const handleSave = () => {
    const data = {
      ...slide,
      title,
      description,
      imageUrl,
      coverImage,
      id: slide?.id || Date.now().toString(),
      placeholder: false,
    };
    onSave(data);
  };

  // 🏷️ Panel heading and labels
  const heading = isSubStage
    ? "✏️ Edit Sub-Stage"
    : isStage
    ? "✏️ Edit Stage"
    : mode === "edit"
    ? "✏️ Edit Slide"
    : `➕ Add New ${category}`;

  const saveLabel = mode === "edit" ? "💾 Save" : "✅ Add";
  const buttonHover = { scale: 1.05, transition: { duration: 0.2 } };
  const buttonTap = { scale: 0.95 };

  // 💡 CSS sizing for mini panels
  const panelClass = `${styles.categoryPanel} ${
    isStage || isSubStage ? styles.miniPanel : ""
  }`;

  return (
    <motion.div
      className={styles.categoryPanelOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={panelClass}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
        <h3>{heading}</h3>

        {/* TITLE */}
        <div className={styles.categoryPanelField}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="your book title"
          />
        </div>

        {/* DESCRIPTION */}
        <div className={styles.categoryPanelField}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="This is your slide for your book — the main foundation of your story project. Inside every slide draw visuals, — that outline your story’s natural progression."
            rows={3}
          />
        </div>

        {/* BOOK SELECTOR */}
      {books.length > 0 && (
        <div className={styles.categoryPanelField}>
          <label>Select a Book</label>
          <select
            value={selectedBookId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedBookId(id);
              const selected = books.find((b) => b.id.toString() === id);
              if (selected) {
                setTitle(selected.title || "");
                setDescription(selected.description || "");
                setCoverImage(selected.coverImage || "");
              }
            }}
          >
            <option value="">-- Choose a Book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
      )}

        {/* IMAGE URL */}
        <div className={styles.categoryPanelField}>
          <label>Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (optional)..."
          />
        </div>

        {/* COVER IMAGE */}
        <div className={styles.categoryPanelField}>
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          <button type="button" onClick={handleAddPremadeImage}>
            🎨 Add Premade Image
          </button>

          {coverImage && (
            <div className={styles.imagePreview}>
              <img src={coverImage} alt="Cover preview" />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className={styles.categoryPanelButtons}>
          <motion.button
            className={styles.saveBtn}
            onClick={handleSave}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            {saveLabel}
          </motion.button>

          <motion.button
            className={styles.cancelBtn}
            onClick={onClose}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            ✖ Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
