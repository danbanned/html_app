import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AddBookPanel.css"; // Reuse AddBookPanel styling
import { useChatCompletion } from "../hooks/useChatCompletion";



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
        //since its a for loop[ letter is the index of each letter
        //add 1 to letter each time its less than the string length 
      hash = tagName.charCodeAt(letter) + ((hash << 5) - hash);
      //charCodeAt gets the unicode number of each letter,  adds it to hash which starts at 0, 
      // the binary code of 5 shifts all the binary bits of hash to the left by 5 spaces
      //and multiplys by 2 each time it shifts getting 32 we multiply that number by hash
      // and multiplying hash by 32 then subtract by hash, and for each time we do that hash,
      // is a different value 
    const hue = Math.abs(hash) % 360;
    //make sure the number is positive and divide it by 360 and keep the remainder
    // to make the hue value in range of 0 - 360 hsl protocol
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

  // ➕ Add a tag
  const addTag = () => {
    if (!currentTag.trim()) return;
    const color = generateTagColor(currentTag.trim());
    const newTag = { name: currentTag.trim(), color };

    setTags((prev) => ({
  ...prev,
  [currentCategory]: [...(prev[currentCategory] || []), newTag],
}));

    setCurrentTag("");
  };

  // ❌ Remove a tag
  const removeTag = (category, tagName) => {
    setTags((prev) => ({
      ...prev,//keeps all exisiting catigories 
      [category]: prev[category].filter((t) => t.name !== tagName),
      //use catogory as a key/ filter creates a new array that only holds catogory tags 
      //that dont = tagname/ we seperate the the tagname 
      //so we extarct whatw\ever ctiogry matches tagname and this is how we remove it 
    }));
  };

  // 🧠 AI Integration: generate suggestions for description and tags
  const handleAIAssist = async () => {
    if (!title && !genre && !description) {
      alert("Please add at least a title or genre before using AI assist.");
      return;
      //make sure these fielsd are filled be ]for making suggestions, if not return 
    }

 setIsGenerating(true);
    try {
      // ✅ Real AI call (using your backend API)
      const payload = {
        messages: [
          { role: "system", content: "You are a creative story assistant." },
          {
            role: "user",
            content: `Generate a short book summary and relevant tags for a ${genre} story titled "${title}". Current description: ${description}`,
          },
        ],
      };
      const result = await chat.mutateAsync(payload);
      // The backend should return { reply, tags?, description? }
      const aiResponse = result.reply;

      if (aiResponse.description) setDescription(aiResponse.description);
      if (aiResponse.tags) setTags(aiResponse.tags);
      //if we recieve value we add  it


    } catch (error) {
      console.error("AI generation failed:", error);
      alert("⚠️ AI generation failed. Try again.");

    } finally {
      setIsGenerating(false);
      //stop generating 
    }
  };

  // Temporary placeholder for AI — replace with your real API call  

  // 💾 Save edited book actually updates uit
  const Submitmybookafteriaddanewoneoreditone = () => {
    if (!title.trim()) return alert("⚠️ Please enter a title!");
    if (!author.trim()) return alert("⚠️ Please enter an author name!");
    if (!genre.trim()) return alert("⚠️ Please enter a genre!");

    //overewrites all the old books 
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

  // Sync fields when switching between books
  useEffect(() => {
    //check to see if these valuse were updated 
    setTitle(book.title || "");
    setAuthor(book.author || "");
    setGenre(book.genre || "");
    setDescription(book.description || "");
    setCoverImage(book.coverImage || "");
    setCoverColor(book.coverColor || "#4a90e2");
    setTags(
        //check to see if the values tages were updated 
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
        <div className="twinkle"></div>

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
                //takes tags turns it into a dictionairy with kays and values 
                //then map loops through them catagory is a key and its value is a list
                //tags is a object with properties and those properties have lists
              <div key={category} className="tag-category"
              //then key gets assigned the catogry like characters ect
              >
                <strong>{category.toUpperCase()}:</strong>
                
                <div className="tag-list"
                //Strong just bolds text we turn all the catogries to uppercase 
                >
                  {list.map((tag) => (
                    //list is the list thats accociated with catogories, we look thorugh those list
                    //to get the tags the catogory has 
                    <span
                      key={tag.name}
                      //then we get every tag name
                      className="tag-item"
                      style={{ backgroundColor: tag.color }}
                      //style translate to css. backgroundColor is an actual css property 
                      //tag.color is a string that we defined 
                      //the line below just displays the tag for the user to see 
                    >{tag.name }

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

        {/* --- ACTION BUTTONS --- */}
        <div className="buttons">
          <button onClick={Submitmybookafteriaddanewoneoreditone}>Save Changes</button>
          <button className="cancel" onClick={onClose}>cancel</button>
            <button onClick={handleAIAssist} disabled={isGenerating} className="ai-button">
            {isGenerating ? "✨ Generating..." : "🤖 AI Assist"}
          </button>
    
        </div>
      </motion.div>
    </motion.div>
  );
}
