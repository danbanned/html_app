<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
VI Storyboard App - Project Scope (CCC.1 Level 10)

Project Name: VI Storyboard App
Target Competency: CCC.1 Develop Technology Solutions (Level 10)
Technical Skills: TS.2.3 Build a Front-End, TS.3.1 Consume APIs (localStorage)
Duration: 2 weeks (10 days)
Target Audience: Writers, storytellers, creative students, mobile users

CCC.1.1: Understand and Identify a Problem (Level 10)
Problem Statement

Core Problem: Storytellers lack a single, interactive environment to plan, visualize, and organize stories, characters, roles, traits, and scenes in one accessible app. Most existing tools are either fragmented, require accounts, or lack visual interactivity.

Context and Implications:

Creative Workflow Fragmentation: Users switch between notes, spreadsheets, and drawing apps.

User Pain Points:

No integrated storyboarding tool combining visual and textual planning

Limited ability to store and edit multiple story elements

Poor mobile-first experience

Lack of zero-friction persistence (offline/local storage)

Stakeholders:

Primary: Writers, storytellers (students, authors, hobbyists)

Secondary: Teachers and creative mentors

Tertiary: Mobile users or accessibility-dependent users

Constraints and Planning

Technical Constraints:

Client-side only (localStorage persistence, no backend yet)

Fixed slot system (20 slots for books/projects)

Student skill level (React, Framer Motion)

Resource Constraints:

Solo development, zero budget

Frontend-only implementation (React + Vite)

Future Challenges

Scalability Challenges:

LocalStorage limitations (~5-10MB)

No backend = no cross-device sync

Performance with large number of storybooks or chapters

Technical Debt:

Client-side only; potential data loss if browser cache is cleared

No search indexing

Manual versioning

Mitigation Strategies:

Modular architecture to allow future backend integration

Use of React hooks and state separation

Implement slot-based storage to reduce conflicts

Analysis of Previous Solutions

Physical notebooks – portable, creative, but no digital sharing or search

Trello / Notion – flexible, but overwhelming for storyboarding

Story Planner Apps – often require accounts, paid tiers, or lack visual interaction

Our Solution:
An interactive, client-side React storyboard app with visual slots, book/chapter management, and zero-friction persistence in localStorage.

CCC.1.2: Identify and Plan a Solution (Level 10)
Solution Overview

Project Description:
A React + Framer Motion web application that enables users to:

Add, edit, and delete storybooks in a slot-based interface (ImagineDesign)

Visualize story structure, characters, scenes, settings (StoryBoard)

Persist storybooks locally without login

Navigate between parent pages: Storyboard (main), ImagineDesign, and planned Roles, Traits, Relates

Technical Challenges and Resource Requirements

LocalStorage Persistence:

Solution: Save books as JSON with slot indexing

Mitigation: Wrap in try/catch; handle parsing errors

Dynamic Slot Management (20 slots)

Solution: Map books array to fixed slots with null placeholders

Mitigation: Ensure length consistency on load/save

Responsive, Interactive UI (Framer Motion)

Solution: Animate sidebar, main content, and overlay panels

Target: Smooth mobile experience

Editing vs. Adding

Solution: Conditional AddBookPanel overlay with existingBook prop

Development Tools:

Node.js, Vite + React, VS Code, Git/GitHub

Framer Motion (animations)

CSS3 + custom responsive styles

Skill Requirements:

React hooks (useState, useEffect)

Component composition (BookMaker, AddBookPanel)

localStorage handling

Routing with React Router

Agile Project Plan (Simplified)

Sprint 1: Project scaffolding (Storyboard, ImagineDesign, routing)
Sprint 2: BookMaker + AddBookPanel integration, slot management
Sprint 3: Story visualization, panels for roles, traits, relates
Sprint 4: UI polish, responsiveness, testing, deployment

CCC.1.3: Implement a Solution (Level 10)

Component Structure:

StoryBoard (Main)
├── ImagineDesign (Sub-parent)
│   ├── BookMaker
│   └── AddBookPanel
├── Roles (planned)
├── Traits (planned)
└── Relates (planned)


Core Implementation Snippets:

ImagineDesign – Slot Management & localStorage

const [books, setBooks] = useState(() => {
  const saved = localStorage.getItem("imagine_books_v1");
  return saved ? JSON.parse(saved).slice(0, 20) : Array(20).fill(null);
});

useEffect(() => {
  localStorage.setItem("imagine_books_v1", JSON.stringify(books));
}, [books]);


Conditional Panel for Adding/Editing Books

<AnimatePresence>
  {showAddPanel && (
    <AddBookPanel
      key={editingBook ? `edit-${editingBook.id}` : `add-${activeSlotIndex}`}
      existingBook={editingBook || null}
      slotIndex={activeSlotIndex}
      onAddBook={handleAddOrUpdateBook}
      onClose={closeAddPanel}
    />
  ));
</AnimatePresence>


Navigation from StoryBoard to Subpages

<button onClick={() => navigation("/imagedesign")}>Imagine Design</button>

CCC.1.4: Test and Improve a Solution (Level 10)

Testing Plan:

Manual testing on 4 devices (desktop, tablet, mobile)

Slot add/edit/delete operations

Overlay panel functionality

localStorage persistence

Responsiveness and animations (Framer Motion)

Metrics:

Slot add/edit/delete completion rate: 100%

Persistence: reload retains all books

Animation smoothness: ≥ 60 FPS on mid-range devices

CCC.1.5: Document and Communicate a Solution (Level 10)

README Overview:

# VI Storyboard App

## Overview
An interactive React app for visualizing and organizing storybooks, characters, scenes, and settings in a zero-friction, localStorage-based environment.

## Features
- Add/Edit/Delete storybooks in 20 slots
- Visualize storyboards and subpages (ImagineDesign, planned Roles/Traits/Relates)
- LocalStorage persistence
- Mobile-first, responsive UI with Framer Motion animations
- No login required

## Tech Stack
- React 18 + Vite
- Framer Motion
- CSS3 (Grid + Flexbox)
- localStorage

## Getting Started
1. Clone repo
2. `npm install`
3. `npm run dev`
4. Navigate to `http://localhost:5173`

## Usage
- Click "Add Book" in `ImagineDesign` sidebar  
- Edit books by clicking on slot covers  
- Navigate between StoryBoard, ImagineDesign, and future subpages  

## Deployment
- Host via Vercel or GitHub Pages

>>>>>>> 16d59d2 (Save work before fixing detached HEAD)
Ai integration proccess

// src/ai/useAI.js
import { useState, useCallback } from "react";

/**
 * useAI Hook
 * Provides a simple interface to call AI tasks in the app.
 * Currently mock-ready for testing offline.
 */
export function useAI() {
  const [aiResponse, setAIResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * callAI
   * @param {Object} options
   * @param {string} options.context - The input text or context
   * @param {string} options.task - The type of task (e.g., "expand chapter", "summarize", "tag", "suggest title")
   */
  const callAI = useCallback(async ({ context, task }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock AI response
      let result;
      switch (task) {
        case "expand chapter":
          result = context + " ...and the story unfolds further, revealing hidden secrets.";
          break;
        case "summarize":
          result = "This is a concise summary of the provided story.";
          break;
        case "tag":
          result = ["mystery", "friendship", "adventure"];
          break;
        case "suggest title":
          result = "The Echoes of Tomorrow";
          break;
        default:
          result = context;
          break;
      }

      // Simulate network delay
      await new Promise((res) => setTimeout(res, 500));

      setAIResponse(result);
      return result;
    } catch (err) {
      console.error("AI call failed:", err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { callAI, aiResponse, isLoading, error };
}
// src/ai/useAI.js
import { useState, useCallback } from "react";

/**
 * useAI Hook
 * Provides a simple interface to call AI tasks in the app.
 * Currently mock-ready for testing offline.
 */
export function useAI() {
  const [aiResponse, setAIResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * callAI
   * @param {Object} options
   * @param {string} options.context - The input text or context
   * @param {string} options.task - The type of task (e.g., "expand chapter", "summarize", "tag", "suggest title")
   */
  const callAI = useCallback(async ({ context, task }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock AI response
      let result;
      switch (task) {
        case "expand chapter":
          result = context + " ...and the story unfolds further, revealing hidden secrets.";
          break;
        case "summarize":
          result = "This is a concise summary of the provided story.";
          break;
        case "tag":
          result = ["mystery", "friendship", "adventure"];
          break;
        case "suggest title":
          result = "The Echoes of Tomorrow";
          break;
        default:
          result = context;
          break;
      }

      // Simulate network delay
      await new Promise((res) => setTimeout(res, 500));

      setAIResponse(result);
      return result;
    } catch (err) {
      console.error("AI call failed:", err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { callAI, aiResponse, isLoading, error };
}
