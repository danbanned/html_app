👇

📘 Project Agreement: “ImagineDesign / Storyboard Book App”

Author: Daniel Johnson
Date: October 6, 2025
Project Type: Interactive Book & Storyboard Builder (React App)

🧱 Project Overview

Goal:
Create a book creation app that allows users with big imaginations—but little or no art skills—to build and visualize their own stories.
Users can:

Create books with titles, authors, covers, and genres.

Add, edit, and delete books.

Manage scenes, characters, settings, and moods.

Have AI assist in writing or expanding stories.

Experience smooth, animated UI transitions and visual effects (sparkles, page flips, etc.).

🧩 Core Component Structure & Flow
ImagineDesign (Parent)
 ├── BookMaker (Displays and manages books)
 │     ├── AddBookPanel (Creates new books)
 │     └── EditBookPanel (Edits existing books)
 └── Storyboard (Future feature: detailed scene builder)

⚙️ Application Data Flow

Data Flow Summary:

User clicks “Add Book” in ImagineDesign.jsx

Opens AddBookPanel.jsx form → fills in details

onSubmit → sends newBook → back to ImagineDesign

ImagineDesign updates its books state → passes down to BookMaker.jsx

BookMaker displays books and handles open/edit/delete actions

Selecting a book triggers a transition → opens EditBookPanel.jsx

EditBookPanel edits book info → sends updated book to ImagineDesign via onUpdateBook()

📁 Component Breakdown
🧩 ImagineDesign.jsx

Purpose:
Main parent page that manages the entire app’s creative process.
Holds the state for all created books and passes them to BookMaker.

Responsibilities:

 Stores and manages the array of books (useState)

 Handles adding new books (from AddBookPanel)

 Handles editing existing books (via EditBookPanel)

 Controls which panel (add/edit/view) is active

 Provides the interactive layout of all book slots

 Add collaboration features

 Add book “sparkle” and animation when clicked

 Connect ImagineDesign visually to Storyboard

Interactions:

Passes onAddBook, onEditBook, onDeleteBook handlers to BookMaker

Opens AddBookPanel and EditBookPanel conditionally inside AnimatePresence

📚 BookMaker.jsx

Purpose:
Handles visual display and interaction of books within ImagineDesign.
Shows placeholders for empty slots and clickable books for existing entries.

Responsibilities:

 Renders all books and placeholders on a “bookshelf” layout

 Handles click → open book (via onOpen)

 Handles click → edit book (via onEdit)

 Handles delete → remove book (via onDelete)

 Handles animations and transitions

 Implement smooth “flip-open” animation with sparkles

 Add hover and 3D depth interactions for covers

 Display tags visually on covers (mood, scenes, etc.)

Interactions:

Receives book data from ImagineDesign

Sends click/edit/delete actions back up to parent

📝 AddBookPanel.jsx

Purpose:
Form panel for creating a brand-new book entry.

Responsibilities:

 Accepts user inputs (Title, Author, Genre, Description, Tags)

 Supports Cover Image upload via FileReader

 Generates color if no image selected

 Validates required fields

 Saves all book data in newBook object

 Sends data upward via onAddBook(newBook)

 Connect AI “auto-title/description” generator

 Add error display for invalid submissions

Interactions:

Called by ImagineDesign

Sends completed book data to ImagineDesign

Will eventually connect to AI endpoint (useChatCompletion)

✏️ EditBookPanel.jsx

Purpose:
Panel for editing and updating existing book data.

Responsibilities:

 Prefills book info using existingBook prop

 Allows edits to title, author, genre, and tags

 Updates book info with onUpdateBook()

 Handles panel close via onClose()

 Add “AI assist” for rewriting or summarizing book text

 Enable live preview of cover and text changes

Interactions:

Receives book={editingBook} from ImagineDesign

Sends updated info via onUpdateBook(updatedBook)

💬 useChatCompletion.js (AI Hook)

Purpose:
Handles async communication with your AI backend (OpenAI or local API).

Responsibilities:

 Wraps fetch("/api/chat") call

 Uses React Query’s useMutation for AI requests

 Returns response.json() with AI-generated text or tags

 Needs connection to backend (chatRouter.js)

 Integrate with AddBookPanel and EditBookPanel

Interactions:

Called by AddBookPanel and EditBookPanel

Uses QueryClientProvider wrapper in main.jsx

🧠 Server (Backend)

Purpose:
Handles AI requests and connects frontend to OpenAI API.

Files:

 index.js – sets up Express server

 chatRouter.js – handles POST /api/chat route

 .env – store OpenAI API key securely

Responsibilities:

 Receives book data or prompts from frontend

 Sends to OpenAI (or fakeAIResponse for now)

 Format and return structured response

🎨 UI & Visual Goals

 Smooth transition when book opens (page flip, parallax, sparkles)

 Canvas-inspired “vision board” layout for Storyboard

 Tag colors based on hash → consistent theme color

 Live theme switching and lighting adjustments

🚀 Future Additions

 Storyboard Page → AI + manual scene builder

 Collaboration mode (shared editing)

 Voice-over / text-to-speech story reader

 AI “co-writer” that generates story pages

 Database (Firebase or Supabase) to persist books