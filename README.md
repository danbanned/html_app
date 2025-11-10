# 📘 VI Storyboard App (ImagineDesign)
### AI-Assisted Storytelling & Worldbuilding

<p align="center">
  <img src="https://via.placeholder.com/1200x280/0b1220/9dd3ff?text=VI+Storyboard+App+%7C+ImagineDesign" 
       alt="VI Storyboard App banner" width="100%" />
</p>

---

## 📦 Installation

### Frontend Setup

# 1. Clone the repository
git clone https://github.com/yourusername/vi-storyboard-app.git

# 2. Install dependencies (both client & server)
npm install
npm install react react-dom
npm install -D vite
npm install framer-motion
npm install axios
npm install lucide-react
npm install clsx
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install eslint eslint-plugin-react eslint-plugin-react-hooks

# 2.2 install api and ai dependecies

npm install express cors dotenv openai
npm install express dotenv openai
npm install cors nodemon body-parser
npm init -y
npm install --save-dev nodemon




# 3. Secure your API key (in the backend root)
echo "OPENAI_API_KEY=sk-your-secret-key-here" > .env

# 4. Run the development servers
npm run dev



# 4️⃣ Open in your browser
http://localhost:5173
--------------------------
Backend installation
cd ../server      # navigate to backend folder
npm install

Then create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_database_uri_here
OPENAI_API_KEY=your_api_key_here

📘 VI Storyboard App (or ImagineDesign) is an interactive, client-side React application designed for writers and storytellers.
It provides a visual, zero-friction environment to plan, visualize, and organize creative concepts by blending category-based storyboarding with AI-assisted idea generation using the GPT-4o-mini model.

🧩 Table of Contents

.Overview

.Core Solution & Features

.Screenshots & Demo

.Technical Architecture

.Unified File Structure

.AI Integration System

.Design Systems

.Navigation Flow

.Data Management

.Project Scope

.Getting Started

.Contributing

.License & Author

🧠 Overview

VI Storyboard App (ImagineDesign) is an interactive client-side React application for writers, storytellers, and creators.
It provides a frictionless visual workspace to plan, visualize, and organize creative concepts — blending category-based storyboarding with AI-assisted generation powered by GPT-4o-mini.

💡 Core Solution & Features

The app provides a single interactive environment for worldbuilding and story design, overcoming the fragmentation of existing creative tools.

| Feature Area            |   Description    | Key Mechanism     \\                                                                        |                         |                  | --------------------------------------------------------------------------| -------- -------------- ----|------------------|
| **Storyboard & Navigation** | Central hub for planning and navigation between Themes, Characters, Scenes, and Settings | React Router DOM 
*----------------------------------------------------------------------------------*
| **AI Integration**| Provides 'creative'| GPT-4o-mini via backend |
|                   |  'suggestions      |
|                   |  (titles, summaries|
|                   |  tags'             |
*----------------------------------------------------------------------------------*
| **Book Management**| Add 'edit and read'| Local persistence|
|                    | 'books chapters and|
|                    | pages'             |
*----------------------------------------------------------------------------------*
| **Design System** |   Smooth 'animations'| Framer Motion + CSS | 
|                   |   'cards, and        |
|                   |   transitions'       |
*----------------------------------------------------------------------------------*
| **Data Persistence**| Saves 'user data in'  | `localStorage (imagine_books_v1)` |
|                     | 'browser'             | 
*------------------------------------------------------------------------*
Feature Area — Description — Key Mechanism

Storyboard & Navigation
 central hub for story planning, allowing navigation to deep editing pages for Theme, Characters, Scene, and Setting. Uses React Router for clean, path-based page switching.

Main-Pages
-----------
Files:
 ├─ StoryboardPage.jsx,
 ├─ ImagineDesign.jsx,
 ├─ MainPage.jsx

 Imagine-Components
-------------------
Files:
├─ AddBookPanel.jsx
├─ BookMaker.jsx
├─ EditBookPanel.jsx
├─ ReadYourBook.jsx

storyboard-component
--------------------
Files:
├─ AIContext.jsx
├─ CategoryPage.jsx
├─ CategoryPanelBase.jsx
├─ FloatingForest.jsx



AI-Integration
Modular system providing creative assistance (summaries, title suggestions, tag generation) via a secure, proxied backend. Mock-ready for offline development.
Files: useChatCompletion.js, GPT-4o-mini


Book-Management
Allows adding, editing, and reading books, chapters, and pages. Each book includes metadata, cover art, and categorized tags.
Files: BookMaker.jsx, EditBookPanel.jsx, ReadYourBook.jsx

Visual-Design
Implements Framer Motion for smooth 3D hover effects on book cards and slide-in overlay animations for panels.
Mechanics: Custom CSS + Framer Motion

Data-Persistence
All user-created books, chapters, and storyboard slides are saved directly to the browser, ensuring data remains after refresh.
Storage Key: localStorage (imagine_books_v1)

🖼️ Screenshots & Demo
| View           | Preview                                 |
| -------------- | --------------------------------------- |
| Storyboard Hub | ![Storyboard](demo/storyboard-demo.gif) |
| EditBookPanel  | ![Editor](demo/editpanel-demo.gif)      |
| AI Assistant   | ![AI](demo/ai-demo.gif)                 |


**View-Preview**
Storyboard Hub	
EditBookPanel	
AI-Assistant	
ReadMode
AI-trace

![App Demo](demo/storyboard-demo.gif)

Technical Architecture & Component Flow

 system is built on a React 18 + Vite frontend and an Express/Node.js backend, interconnected through specific, resilient components.

Unified File Structure
<details> <summary>Click to expand file layout</summary>
src/
 ├─ ai/
 │  └─ useAI.js            # Mock-ready AI utility hook
 ├─ components/
 │  ├─ AIPanel.jsx         # Floating global AI assistant
 │  ├─ BookMaker.jsx       # Manages book grid, opens/closes states
 │  ├─ BookLabels.jsx      # Renders color-coded tags
 │  ├─ EditBookPanel.jsx   # Animated editing overlay
 │  ├─ ReadYourBook.jsx    # Chapter editor/reader
 │  └─ FormForbOOKS.jsx    # General form inputs
 ├─ pages/
 │  ├─ StoryboardPage.jsx  # Main hub
 │  ├─ MainPage.jsx    # Individual story element page
 │  └─ ImagineDesign.jsx   # Core book creation interface
 ├─ styles/
 │  ├─ StoryboardPage.css
 │  └─ AddBookPanel.css
    └─ more...  
 ├─ App.jsx                # Router configuration
 └─ main.jsx
 └─ Navigation.jsx               # Entry point


| **Item**         | **Context**                    | **Status**    |
| ---------------- | ------------------------------ | ------------- |
| Technical Skill  | Build Front-End, Consume APIs  | ✅ Achieved    |
| Duration         | 2 Weeks (10 Days)              | ✅ Completed   |
| Navigation       | React Router                   | ✅ Implemented |
| Data Persistence | LocalStorage                   | ✅ Implemented |
| UI Polish        | Modals, Drag-to-Reorder        | 🟡 Partial    |
| Future           | Cloud Sync, Multi-User Stories | 🕓 Planned    |


</details>
AI Integration System

The application securely uses the GPT-4o-mini model through a backend proxy, preventing the API key from being exposed on the client.

<details> <summary>Frontend Hook — <code>useChatCompletion.js</code></summary>
// uses @tanstack/react-query
import { useMutation } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";

export function useChatCompletion() {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
  });
}


</details> <details> <summary>Backend Endpoint — <code>chatRouter.js / server.js</code></summary>



// Backend snippet - Centralized AI Endpoint
import express from "express";
import OpenAI from "openai";
const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // secured via dotenv

app.post("/api/ask", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: req.body.prompt }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

</details>

⚠️ Debugging Tip: If AI output is stale after changing the prompt, restart your Node.js server to reload the updated code and environment variables.

----------------------------------

🎨 Design Systems: Tagging & Animation
🎨 Tag Color Generator

To ensure visual consistency, every tag (e.g., "Max", "mystical") is assigned a unique, fixed color based on its text content using a bitwise hashing function:

const generateTagColor = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++)
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 75%)`;
};


🪶 Animated Panels (EditBookPanel.jsx)

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
    {/* Editing UI */}
  </motion.div>
</motion.div>


The editing panel is an animated overlay, prioritizing smooth transitions and data integrity:




The component is resilient by checking for undefined data (if (!book) return null;) and ensuring required arrays are initialized (book.tags || {}).

🧭 Navigation & Visualization Flow

| **Step**           | **Component(s)**               | **Description**                         
| ------------------ | ------------------------------ |  |------------------------------------- |
| Main Hub           | `StoryboardPage.jsx`           | Displays creative categories.          |
| Category Selection | `StoryboardPage.jsx → App.jsx` | Navigates via React Router.            |
| Category Content   | `CategoryPage.jsx`             | Renders category dynamically.          |
| AI Access          | `AIPanel.jsx`                  | Global assistant available everywhere. |

■ VI Storyboard — Technical Documentation

### Navigation System Overview

The navigation system uses **React Router** to enable deep linking to specific story categories.
| Step | Component(s) Involved | Description |
|------|------------------------|--------------|
| Main Hub | StoryboardPage.jsx | Presents the four core creative categories: Theme, Characters, Sc| Category Selection | StoryboardPage.jsx → App.jsx | Clicking a category box triggers navigate('/c| Category Content | CategoryPage.jsx | Uses useParams() to dynamically render content for the spec| AI Access | AIPanel.jsx (Global) | A position: fixed element with a high z-index ensures the AI a### The Book Lifecycle (Data Management)
Story data is managed in a hierarchy, utilizing robust state handling and local persistence.
// Example Book Object
{
 id: 1,
 title: "The Blue Moon Chronicles",
 coverColor: "#3A5FCD",
 tags: {
 characters: [{ name: "Ari", color: "hsl(...)" }],
 scenes: [{ name: "Temple of Wind", color: "hsl(...)" }],
 mood: [{ name: "Mysterious", color: "hsl(...)" }]
 },
 chapters: []
}


### Core Data Handlers
- **BookMaker.jsx** — Renders the primary BookShelf grid and manages open/closed state of
individual books. - **EditBookPanel.jsx** — Provides UI for modifying existing book data with defensive
rendering. - **ReadYourBook.jsx** — Manages page creation, deletion, and autosave via localStorage
(`imagine_books_v1`).
### AI Integration & Backend Pipeline
import { useMutation } from "@tanstack/react-query";
export function useChatCompletion() {
 return useMutation({
 mutationFn: async (payload) => {
 const response = await fetch("http://localhost:5000/api/chat", { /* ... */ });
 if (!response.ok) throw new Error(await response.text());
 return response.json();
 },
 });
}
> **Security Note:** The Express server must load `OPENAI_API_KEY` from `.env` and never expose
it to the client.

**Reminder**
-------------
### ■ Getting Started

# 1. Clone the repository
git clone https://github.com/yourusername/vi-storyboard-app.git
# 2. Install dependencies (run in both client and server roots)
npm install
# 3. Secure your API key (in the backend root)
# create a .env file containing:
# OPENAI_API_KEY=sk-your-secret-key-here
# 4. Run the development servers
npm run dev


### ■ Contributing
git checkout -b feat/my-feature
git commit -am "Add my feature"
git push origin feat/my-feature
### ■ License & Author
**Author:** Daniel Johnson (danbanned) — Frontend Engineer & Creative Developer **License:** MIT
License — See LICENSE for details.

**CatagoryPage**

how the slides are doing what they are doing 

{
  id: "book-1",
  title: "My Book Title",
  description: "A summary of the book",
  placeholder: false,
  coverImage: "...",
  expanded: false,
  children: [
    {
      id: "stage-1",
      title: "Exposition",
      description: "Introduce your world, setting, and main characters.",
      expanded: false,
      children: [
        {
          id: "scene-1",
          title: "Opening Scene",
          description: "The hero wakes up to a normal day.",
        },
        {
          id: "scene-2",
          title: "Inciting Event",
          description: "The hero receives a mysterious letter.",
        },
      ],
    },
    // Rising Action, Climax, Falling Action, Resolution
  ],
}


**future installations**

  <div className="storyboard-container">
  <h1>My Storyboard</h1>
  <p className="intro-text">slide showmaker.</p>

  <div className="storyboard-grid">
    {categories.map((slide) => (
      <div key={slide.id} className="storyboard-box">
        <h2>{slide.title}</h2>
        <p>{slide.description}</p>
      </div>
    ))}
  </div>
</div>

# 🌐 Traits & Relates — The Story Connector

**Part of the VI Story App**

---

## 🧩 Overview

**Traits & Relates** is a storytelling feature designed to **connect every emotional and narrative thread** in your story — linking characters, traits, and scenes into one interactive network.

It acts as your story’s **emotional map**, showing how every choice, feeling, and relationship shapes the journey of your characters.

---

## 🎯 Purpose

Writers often create deep story elements but lose sight of how they all interconnect.  
**Traits & Relates** solves this by visualizing the emotional and thematic relationships within your story world.

This feature helps creators:
- Track emotional consistency across scenes  
- Visualize how traits drive actions  
- Discover patterns in their storytelling  
- Strengthen character development and motivation  

---

## ✨ Core Concept: Story Web

A **visual graph map** connects your story’s core elements:

| Node Type | Description |
|------------|--------------|
| 🧍 **Character** | Main and supporting figures in your story |
| 💭 **Trait** | Attributes like courage, envy, loyalty |
| ❤️ **Emotion** | Key emotional drivers for characters and scenes |
| ⚡ **Event / Scene** | Major story moments that reveal traits or conflicts |
| 🏞 **Setting** | The environment where key emotions or events occur |

Each node connects to others, forming a **living web of relationships** that evolves as your story grows.

---

## 🧠 Features

| Feature | Description |
|----------|--------------|
| **Visual Story Map** | Drag, zoom, and explore a web of story connections. |
| **Emotional Color Coding** | Each emotion glows with a unique color (e.g., blue = calm, red = conflict). |
| **Connection Insights** | Click a link to see how a character’s emotion affects a scene or event. |
| **Character Comparison** | Overlay two characters to see shared or contrasting traits. |
| **Story Balance Meter** | AI-generated summary showing which emotions dominate your narrative. |

---

## 🎨 UI Vision

The interface resembles a **floating, glowing web** that reacts to cursor or touch interactions.

When you hover over a node:
- Connected traits and scenes softly pulse.  
- A tooltip displays the emotional relationship (e.g. *“Lina’s fear drives the forest scene”*).  
- The web visually “breathes,” symbolizing your story’s living heartbeat.

---

## 🧭 Example Workflow

1. **Select a Character** — e.g., *Lina*  
2. **Add Traits & Emotions** — *Courage, Fear, Compassion*  
3. **Connect Scenes** — *Forest Battle, Mirror Dream*  
4. **View the Web** — Watch connections form dynamically  
5. **Analyze Insights** — The system highlights emotional growth or imbalance

---

## 🪄 Why It Matters

Stories are built from emotions, not just events.  
**Traits & Relates** helps writers visualize that inner world — the *why* behind every *what*.

It’s not just storytelling.
It’s story-**feeling**.

---

## 🚀 Integration

This module connects directly with:
- **StoryBoarding** — visualize scenes that express each emotion.  
- **Imagine & Design** — link visual sketches to character traits.  
- **Roles** — map relationships across the story’s cast.

---

## 💡 Future Enhancements

- AI-powered **relationship suggestions**
- Sentiment-based **emotion detection** from text
- “Story Sync” — automatic updates to other story modules

---

### 🖋️ Created by
**Daniel Johnson**  
*for the VI Story App Project*

# 📜 Roles — The Story’s Background Blueprint

**Part of the VI Story App**

---

## 🧩 Overview

**Roles** is the foundation of your story world — a space where creators can visualize **backgrounds, histories, and world origins** through a **2D paper-kit wireframe** interface.

It’s designed to look and feel like a creative desk — where paper notes, sketches, and strings connect the past that built your present story.

---

## 🎯 Purpose

Every story begins long before the first scene.  
The **Roles** section captures those **hidden timelines, untold backstories, and world foundations** that define why your story exists.

It helps creators:
- Build logical and emotional origins for their stories  
- Track how history shapes current events  
- Keep lore and world consistency organized  
- Create symbolic or generational connections between characters and events  

---

## ✨ Core Concept: The Paper World

**Roles** is imagined as a **paper world** — each story element is represented as a draggable “paper card” connected by threads that form a visual timeline.

| Element Type | Description |
|---------------|--------------|
| 🧍 **Character Roles** | Defines purpose or archetype (e.g., Mentor, Healer, Rebel) |
| 🏰 **World Origins** | Describes past civilizations, families, or timelines |
| ⚙️ **Causality Threads** | Visual links that explain why events or traits exist |
| 🕰️ **Timeline Layers** | Flip between present and historical story layers |

---

## 🧠 Features

| Feature | Description |
|----------|--------------|
| **Paper Cards** | Drag-and-drop cards representing roles, origins, and key events. |
| **Layer Toggle** | Switch between the *Present* and *Past* layers of your story world. |
| **Thread Connections** | Draw color-coded lines between cards to show relationships or causes. |
| **Card Flipping** | Click a card to flip it and reveal backstory notes or sketches. |
| **Role Builder** | Assign narrative functions (e.g., *Catalyst*, *Witness*, *Protector*). |
| **Corkboard Layout** | A wireframe-inspired canvas that feels hand-drawn and tactile. |

---

## 🎨 Visual Style

**Theme:**  
A handcrafted **paper-kit aesthetic** — part sketchbook, part corkboard.  
Each element looks like it was **cut, pinned, or taped** onto a creative surface.

**Design Traits:**
- Light pencil outlines and subtle shadowing  
- Fold, drag, and rotate animations for realism  
- Colored strings linking cards like a detective board  
- Optional “crumpled note” textures for vintage depth  

---

## 🧭 Example Workflow

1. **Open the Roles Tab** — the corkboard canvas loads.  
2. **Add a Card** — create “The Fire War” as a world event.  
3. **Add a Role** — create “The Healer” as a survivor.  
4. **Connect Them** — drag a red thread between them (symbolizing memory or trauma).  
5. **Flip the Card** — view handwritten-style notes describing the event’s origin.

---

## 💬 Creative Purpose

**Roles** isn’t just world-building — it’s **world remembering**.  
It lets creators:
- Trace the chain of cause and effect  
- Discover how personal and world histories overlap  
- Give emotional and symbolic meaning to events before they unfold  

By visualizing your story’s **DNA**, Roles ensures every new scene has a past that feels alive.

---

## 🚀 Integration

The **Roles** section connects with:

- **Traits & Relates** — pulls historical emotional data for traits and relationships.  
- **StoryBoarding** — links past events to current story scenes.  
- **Imagine & Design** — syncs character visuals with their historical origins.

---

## 🪄 Future Enhancements

- **AI Timeline Builder** — auto-generates historical sequences based on story input.  
- **Lore Sync** — connects world events to character bios across all categories.  
- **Printable “Paper Map” Mode** — export your story’s entire history as an illustrated board.

---

### 🖋️ Created by
**Daniel Johnson**  
*for the VI Story App Project*


| Hook Name          | Purpose                                                                 | Input                                                                                       | Output / Returns                                                  |
|-------------------|-------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `useStoryCoach`    | Manages AI chat with writing advice and image concept generation       | `initialBook` object `{ title, genre, description }` or string messages                     | `{ messages, sendMessage, isThinking, images, setBook, latestResponse }` |
| `useChatCompletion`| Handles API calls to backend `/api/chat` and normalizes responses       | Payload object `{ mode, messages?, bookContext?, userProfile?, chatHistory? }`             | Normalized response based on mode: `{ type, output, imagePrompt }` or `{ type, description, tags, imagePrompt }` |
