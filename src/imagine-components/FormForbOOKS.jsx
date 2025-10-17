import { useState } from "react";
import "../styles/FormForbOOKS.css";

// --- TITLE SUBMIT FORM ---
export function Submittitle({ onSave }) {
  const [click, clicked] = useState("");

  function formisdifferentgetit(e) {
    clicked(e.target.value);
  }

  function densubmitit(e) {
    e.preventDefault();

    if (!click.trim()) {
      alert("Please enter something before submitting!");
      return;
    }

    // ✅ Instead of alert, use handleSave
    handleSave(click);

    clicked(""); // clear input
  }

  // --- Handle Save Function ---
  function handleSave(value) {
    // If parent passed a save handler, call it
    if (onSave) {
      onSave(value);
    } else {
      // fallback (for now)
      console.log("Saved title:", value);
      alert(`Saved: ${value}`);
    }
  }

  return (
    <form onSubmit={densubmitit}>
      <label>
        What can I do for you?:
        <input
          type="text"
          value={click}
          onChange={formisdifferentgetit}
          placeholder="Enter title..."
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

// --- PANEL SUBMIT FORM ---
export function Panelsubmit({ onSave }) {
  const [Pclick, Pclicked] = useState("");

  function formisdifferentgetit(e) {
    Pclicked(e.target.value);
  }

  function densubmitit(e) {
    e.preventDefault();

    if (!Pclick.trim()) {
      alert("Please enter something before submitting!");
      return;
    }

    // ✅ Use handleSave
    handleSave(Pclick);

    Pclicked(""); // clears input
  }

  // --- Handle Save Function ---
  function handleSave(value) {
    if (onSave) {
      onSave(value);
    } else {
      console.log("Saved panel input:", value);
      alert(`Saved: ${value}`);
    }
  }

  return (
    <form onSubmit={densubmitit}>
      <label>
        Submit panel:
        <input
          type="text"
          value={Pclick}
          onChange={formisdifferentgetit}
          placeholder="Enter panel name..."
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
