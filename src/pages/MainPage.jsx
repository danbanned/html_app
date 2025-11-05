import "../styles/MainPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Joyride, { STATUS } from "react-joyride";
import { useTutorial } from "../components/TutorialContext";


export default function StoryBoard() {
  const navigation = useNavigate();
  const { setStoryTourDone } = useTutorial();
  const [guidepagetrigger,setguidepagetrigger] = useState(null)

  const [state, setState] = useState({
    run: false,
    steps: [
      {
        target: "body",
        placement: "center",
        content: <h2>Welcome to VI Story — let's begin the tour!</h2>,
      },
      {
        target: "#step1",
        title: "Storyboard Feature",
        content:
          "Start your story creation here! Think, write, and design scene by scene.",
      },
      {
        target: "#step2",
        title: "About the Page",
        content:
          "This page shows your interactive tools for story creation and editing.",
      },
      {
        target: "#step3",
        title: "Your Content",
        content:
          "Access your saved content and refine your storybook elements here.",
      },
      {
        target: "#USEI",
        title: "Imagine Design",
        content:
          "Use this to build visuals and creative imagery for your storybook.",
      },
      {
        target: "#USET",
        title: "Traits & Relates",
        content:
          "Define emotions, morals, and character dynamics — make your story feel alive.",
      },
      {
        target: "#USER",
        title: "Roles Section",
        content:
          "Define your character relationships — who’s who in your story.",
      },
      {
        target: "body",
        placement: "center",
        content: <h2>That’s it! You’re ready to start creating 🎨</h2>,
      },
    ],
  });

    const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setStoryTourDone(true);
      navigation("/imagedesign");
    }
  };

  const startTour = () => {
    setState((prev) => ({ ...prev, run: true }));
  };

  function Guidepage({ buttonId, onClose }) {
  // Define multi-step content for each section
    const guideSteps = {
        USEI: [
          {
            title: "Step 1 — Getting Started with Imagine Design",
            text: "This is where you bring your ideas to life visually. You can add art, layout pages, and design story elements.",
          },
          {
            title: "Step 2 — Adding Visuals",
            text: "Click 'Add Page' to start creating. You can insert images, text boxes, or even upload your own artwork.",
          },
          {
            title: "Step 3 — Save & Continue",
            text: "Once you’re happy with your page, hit 'Save' to keep your progress and move to the next step of your project.",
          },
        ],
        ABOUTI: [
          {
            title: "Step 1 — What Is Imagine Design?",
            text: "Imagine Design helps you turn story ideas into visual layouts for books, comics, or storyboards.",
          },
          {
            title: "Step 2 — Interface Overview",
            text: "You’ll see tools on the left for shapes, colors, and images. Use the right panel to adjust text or art layers.",
          },
          {
            title: "Step 3 — Quick Tip",
            text: "Double-click on any element to edit it quickly — no need to go through menus!",
          },
        ],
        CONTENTI: [
          {
            title: "Step 1 — Your Visual Library",
            text: "All your created or uploaded content appears here for reuse in different pages.",
          },
          {
            title: "Step 2 — Managing Content",
            text: "Hover over an item to rename, delete, or duplicate it — making project organization easy.",
          },
          {
            title: "Step 3 — Exporting",
            text: "When done, click 'Export' to save your visuals or generate a printable version.",
          },
        ],

        // StoryBoarding buttons
      step1: [
        {
          title: "Step 1 — Getting Started with StoryBoarding",
          text: "This is where you begin your story creation. Think, write, and design scene by scene.",
        },
        {
          title: "Step 2 — Adding Scenes",
          text: "Click 'Add Scene' to create the first scene in your story. Each scene can contain text and visuals.",
        },
        {
          title: "Step 3 — Organize Your Story",
          text: "Use drag-and-drop to rearrange scenes and build your story flow.",
        },
      ],
      step2: [
        {
          title: "Step 1 — About This Page",
          text: "The StoryBoard page displays your interactive tools for creating and editing your story.",
        },
        {
          title: "Step 2 — Interface Overview",
          text: "The left panel shows your story scenes. The main area is your workspace where you visualize each scene.",
        },
        {
          title: "Step 3 — Tips",
          text: "Hover over elements to reveal more options. You can edit, delete, or duplicate scenes easily.",
        },
      ],
      step3: [
        {
          title: "Step 1 — Your Content",
          text: "Here you can access your saved content and refine your storybook elements.",
        },
        {
          title: "Step 2 — Organizing",
          text: "Rename, move, or delete saved content as needed. Keep your story structured and clean.",
        },
        {
          title: "Step 3 — Quick Access",
          text: "Click any scene to jump directly into editing or adding visuals.",
        },
      ],
    // You can add other button IDs here (like USET, ABOUTT, etc.)
  };

  const steps = guideSteps[buttonId] || [
    { title: "Welcome", text: "No walkthrough steps available for this section yet." },
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else onClose(); // close when finished
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div className="guidepage">
      <button className="on-close" onClick={onClose}>✕</button>

      <h2>{currentStep.title}</h2>
      <p>{currentStep.text}</p>

      <div className="guide-controls">
        <button onClick={handleBack} disabled={stepIndex === 0}>
          ← Back
        </button>

        {stepIndex === steps.length - 1 ? (
          <button onClick={handleNext}>Finish</button>
        ) : (
          <button onClick={handleNext}>Next →</button>
        )}
      </div>

      <p className="guide-progress">
        Step {stepIndex + 1} of {steps.length}
      </p>
    </div>
  );
}


  return (
    <>
      <Joyride
      steps={state.steps}
      run={state.run}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{ options: { zIndex: 10000 } }}
            
    />

      {/* === MAIN CONTENT === */}
      <div className="container">
        <div className="sidebar">
          <h1>VI Story</h1>
          <div className="nav-links">
            <button onClick={() => navigation("/storyboardpage")}>
              Draw Story
            </button>
            <button onClick={() => navigation("/imagedesign")}>
              Create Book
            </button>
            <button>Connect Scenes</button>
            <button>Theme Fine</button>
          </div>
          <div className="sidebar-footer">© 2025 VI Story</div>
        </div>

        {/* Add a start tour button on main layout */}
        <div className="tutorial-start">
          <button onClick={startTour} className="start-tour-btn">
            🎯 Start Tour
          </button>
        </div>

        <div className="diagram">
          <div className="center">
            <div className="heart">❤️</div>
            <h1>VI Story</h1>
            <p>
              Visualize your goals, intentions, and aspirations across life
              areas in one inspiring, interactive book.
            </p>
          </div>

          {guidepagetrigger && (
          <div className="guidepage-modal">
            <div className="guidepage-content">
              <Guidepage
              buttonId={guidepagetrigger}
               onClose={() => setguidepagetrigger(false)} />
          
            </div>
          </div>
        )}

          {/* StoryBoarding Section */}
          <div className="boxstoryboard">
            <h2
              className="boxstoryboard"
              onClick={() => navigation("/storyboardpage")}
            >
              StoryBoarding
            </h2>
             <ul>
              <button onClick={() => setguidepagetrigger("step1")}>How To Use</button>
              <button onClick={() => setguidepagetrigger("step2")}>About This Page</button>
              <button onClick={() => setguidepagetrigger("step3")}>Your Content</button>
            </ul>
          </div>

          {/* Imagine Design Section */}
          <div className="boximagine">
            <h2
              className="boximagine"
              onClick={() => navigation("/imagedesign")}
            >
              Imagine <br /> Design
            </h2>
            <ul>
              <button id="USEI" onClick={() => setguidepagetrigger("USEI")}>How To Use</button>
              <button id="ABOUTI" onClick={() => setguidepagetrigger("ABOUTI")}>About This Page</button>
              <button id="CONTENTI" onClick={() => setguidepagetrigger("CONTENTI")}>Your Content</button>
            </ul>
          </div>

          {/* Traits & Relates Section */}
          <div className="boxtraits">
            <h2>Traits &<br /> Relates</h2>
            <ul>
              {/*<button id="USET">How To Use</button>*/}
              {/*<button id="ABOUTT">About This Page</button>*/}
              <button id="CONTENTT">Under Maintenance</button>
            </ul>
          </div>

          {/* Roles Section */}
          <div className="boxroles">
            <h2>Roles</h2>
            <ul>
              {/*<button id="USER">How To Use</button>*/}
              {/*<button id="ABOUTR">About This Page</button>*/}
              <button id="CONTENTR">Under Maintenance</button>
            </ul>
          </div>

        </div>
      
      </div>
    </>
   
  );
}

