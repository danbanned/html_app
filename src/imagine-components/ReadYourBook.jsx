import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ReadYourBook.css";
import { useAI } from "../ai/aiIntegration"; // 🧠 AI import

export default function ReadYourBook({ book, onClose, onSaveBook, startChapter = 1 }) {
//=================USESTATE HARDSAVED BABY========================================
  const [activePage, setActivePage] = useState(0);
  const [aiLoading, setAILoading] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState("");
  const [pages, setPages] = useState(() => [
    //setpages is already look in the current book
    //stop forgetting that evrything happens 1 item at a time 
    {
      //get all of these data types out of book list 
      text: `${book.title}\nby ${book.author}\nGenre: ${book.genre}\nID: ${book.id}`,
      //get the image aswell or if no image return empty
      image: book.coverImage || null,
      //set isfrontcover true
      isFrontCover: true,
    },
    ...(book.chapters?.length
      //then look throw all the chapters via spread operator if any at all get the
      //the overall length 
      ? book.chapters.map((c, idx) => ({
      //is there chapters, if so lets get the chapter name and its index
          ...c,
      // and stor it as a spread operator with all the chapters 
          number: idx + startChapter,
          //lets get the index and add it with startChapter 
          //thius allows us to increase the index by one for everytime the
          //  index increwase
        }))
      : [{ text: "Empty chapter", image: "" }]),
      //empty chapter happens if the book doesnt have chapters/pages 

  ]);
//=================USESTATE HARDSAVED BABY========================================
 //{ text: "Title info...", image: "cover.jpg", isFrontCover: true },
          //{ text: "Chapter 1 text...", number: 1 },
          //{ text: "Chapter 2 text...", number: 2 },
          //...what we are updating, yes this is prev this is pages 
 //=================UPDATES UPDATES UPDATES========================================

  //after we set ai suggestions we come here to store the data 
  const sidebarRef = useRef(null);

  const printmessage = () => {
    alert("Chapters coming soon");
  }
  // Add / Delete / Save / Edit logic same as before...
  const addPage = () => {
    setPages((prev) => [...prev, { text: "", image: null }]);
    setActivePage(pages.length);
    //fist we create all the previouse pages then we add a extra one
    //{ text: "", image: null }]
    //set the activepage to the current amount of pages this keeps us updated on
    //how many pages there are 
  };
  const deletePage = () => {
    if (pages.length === 1) return;
    setPages((prev) => prev.filter((_, i) => i !== activePage));
    setActivePage((prev) => (prev > 0 ? prev - 1 : 0));
    //if only 1 page no delete 
    //filter((_, i) => i !== activePage) removes the page whose index matches activePage.
    //look in the l;ist. no first arguement only second, return number, is page number active?
    //if so bye bye 
    //The _ just ignores the first argument — you only care about the index.
    //This moves your “current page” back one step after deletion,
    //but makes sure it doesn’t go below zero (so it never becomes negative).
  };
  const saveBook = () => {
    const updatedBook = { ...book, chapters: pages.slice(1) };
    //collects the data fron one page, by slicing it and creating it as a seperate
    //list 
    onSaveBook(updatedBook);
    //send that new data to onsavebook
    //which is accoiated wiht the parent 
    //so onsavedbook is literally, just a page in a book 
    alert("✅ Book saved successfully!");
  };

  useEffect(() => {
    if (sidebarRef.current) sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    //control scrolling updatye anytime we scroll
  }, [pages]);
  //pages might be desription and tags

  const handleTextChange = (index, value) => {
    const updated = [...pages];
    //getting pages index n value
    updated[index].text = value;
    //get the text in that index
    setPages(updated);
    //update pages send them back to   const [pages, setPages] = useState(() => [
    //get all the new text and save it in value 

  };
  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...pages];
      updated[index].image = reader.result;
      setPages(updated);

    };
    reader.readAsDataURL(file);
    //translates file
  };

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;
    const updated = [...pages];
    updated[activePage].text += `\n\n${aiSuggestion}`;
    setPages(updated);
    setAISuggestion("");
  };
   //=================UPDATES UPDATES UPDATES========================================
   //=================AI TAKETHE WHEEL========================================


  // 🧠 AI GENERATION
  const handleAIGenerate = async () => {
    //when users open their book to edit what story they
    //wrote they will see this which allows them to make ai suggestions
    //we send a request to the ai asking it to make a suggestion for our nextchapeter
    //using these 
      //title: book.title,
      //chapter: activePage,
      //text: currentText,
      //then we call setAISuggestion with (suggestion);
    setAILoading(true);
    const currentText = pages[activePage].text;
    const suggestion = await useAI("suggestNextChapter", {
      title: book.title,
      chapter: activePage,
      text: currentText,
    });
    setAISuggestion(suggestion);// goes up to applyAISuggestion defined
    setAILoading(false);
  };
  
   //=================AI TAKETHE WHEEL========================================
  
 
{/*=================LETS ADD SOME DETAIL========================================*/}
  return (
    <motion.div
      className="read-your-book gothic-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="reader-header">
        <h2 className="enchanted-title">{book.title}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="book-layout">
        {/* SIDEBAR */}
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-section">
            <h4>Description</h4>
            <p>{book.description}</p>
          </div>

          <div className="sidebar-section">
            <h4>Tags</h4>
            {book.tags && Object.entries(book.tags).map(([category, list]) =>
              list.length > 0 && (
                <div key={category}>
                  <strong>{category}</strong>
                  <div className="tag-bubbles">
                    {list.map((tag) => (
                      <span key={tag.name} className="bubble" style={{ backgroundColor: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {/*=================LETS ADD SOME DETAIL========================================*/}


         {/* 🧠  //=================AI FLOATING BOX ========================================*/}
          <div className="sidebar-section ai-section">
            <motion.h4
              className="ai-header"
              animate={{ textShadow: ["0 0 8px #9fdcff", "0 0 16px #7de0ff", "0 0 8px #9fdcff"] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🔮 AI Assistant
            </motion.h4>

            <motion.button
              className="ai-button"
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px #6be2ff" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAIGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? "✨ Summoning Ideas..." : "Invoke Inspiration"}
            </motion.button>

            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  className="ai-suggestion"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>{aiSuggestion}</p>
                  <button className="apply-ai" onClick={applyAISuggestion}>📜 Transcribe Into Page</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      {/* 🧠  //=================AI FLOATING BOX ========================================*/}


          <div className="sidebar-buttons">
            <button onClick={addPage}>➕ Add Page</button>
            <button onClick={deletePage} disabled={pages.length === 1}>🗑️ Delete Page</button>
            <button onClick={saveBook}>💾 Save Book</button>
            <button onClick={printmessage}> Chapters</button>
          </div>
        </div>

        {/* MAIN BOOK VIEW */}
        <div className="book-view">
          <AnimatePresence mode="wait">
            {pages[activePage] && (
              <motion.div
                key={activePage}
                className="page enchanted-page"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <textarea
                  className="page-text"
                  value={pages[activePage].text}
                  onChange={(e) => handleTextChange(activePage, e.target.value)}
                  placeholder="Start writing your story..."
                />
                {pages[activePage].image && (
                  <img src={pages[activePage].image} alt="page visual" className="page-image" />
                )}
                <label className="image-upload">
                  📸 Add Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(activePage, e.target.files[0])}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
{/*=================DIFFERENT PAGE FOR DIFFERENT NAMES AND SO ON AND SO ON AND AHHHHHHHHHHHHHHHHHHHHH AND EVERYDAY ========================================*/}
          <div className="page-controls">
            <button disabled={activePage === 0} onClick={() => setActivePage((p) => p - 1)}>◀ Prev</button>
            <span>Page {activePage + 1} of {pages.length}</span>
            <button disabled={activePage === pages.length - 1} onClick={() => setActivePage((p) => p + 1)}>Next ▶</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
