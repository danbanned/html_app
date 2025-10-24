import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/CategoryPanel.module.css";

export default function CategoryPanelBase({
  mode = "add", // "add" | "edit"
  category,
  slide = null,
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");

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

  // Prefill fields if editing
  useEffect(() => {
    if (mode === "edit" && slide) {
      setTitle(slide.title || "");
      setDescription(slide.description || "");
      setImageUrl(slide.imageUrl || "");
      setCoverImage(slide.coverImage || "");
    }
  }, [mode, slide]);

  const handleSave = () => {
    const data = {
      ...slide,
      title,
      description,
      imageUrl,
      coverImage, // ✅ now included
      id: slide?.id || Date.now().toString(),
      placeholder: false,
    };
    onSave(data);
  };

  const heading = mode === "edit" ? "✏️ Edit Slide" : `➕ Add New ${category}`;
  const saveLabel = mode === "edit" ? "💾 Save" : "✅ Add";
  const buttonHover = { scale: 1.05, transition: { duration: 0.2 } };
  const buttonTap = { scale: 0.95 };

  return (
    <motion.div
      className={styles.categoryPanelOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.categoryPanel}
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
            placeholder="Enter title..."
          />
        </div>

        {/* DESCRIPTION */}
        <div className={styles.categoryPanelField}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter short description..."
            rows={3}
          />
        </div>

        {/* IMAGE URL */}
        <div className={styles.categoryPanelField}>
          <label>Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (optional)..."
          />
        </div>

        {/* COVER IMAGE PREVIEW */}
        <div className={styles.categoryPanelField}>
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <button onClick={handleAddPremadeImage}>🎨 Add Premade Image</button>

          {/* 🖼️ Show preview if coverImage exists */}
          {coverImage && (
            <div
              style={{
                marginTop: "10px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={coverImage}
                alt="Cover preview"
                style={{ width: "100%", height: "auto" }}
              />
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
