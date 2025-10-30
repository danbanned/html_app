// src/components/DrawingBoard.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/DrawingBoard.css";

export default function DrawingBoard({
  width = 900,
  height = 600,
  initialColor,
  initialSize,
  slideId = "default",
  slideName = "untitled",
  category = "default",
  onSaveDrawing, // optional callback parent can pass
}) {
  // refs & basic state
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("brush"); // brush | eraser | text
  const [color, setColor] = useState(initialColor || "#111827");
  const [size, setSize] = useState(initialSize || 4);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [textMode, setTextMode] = useState(false);

  // existing AI image, prompt, tracing bits kept
  const [aiImage, setAiImage] = useState(null);
  const [isTracing, setIsTracing] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  // AI palette
  const [aiPalette, setAiPalette] = useState([]);

  // floating AI panel
  const [aiPanelOpen, setAiPanelOpen] = useState(() => {
    try {
      const v = localStorage.getItem("drawing_aiPanelOpen");
      return v ? JSON.parse(v) : false;
    } catch {
      return false;
    }
  });

  const baseKey = (k) =>
    `${k}_${category}_${String(slideName || slideId).replace(/\s+/g, "_").toLowerCase()}`;


  function saveImageToList(imageDataUrl) {
  try {
    const slides = JSON.parse(localStorage.getItem("slides")) || [];
    const updatedSlides = slides.map(slide =>
      slide.id === slideId
        ? { ...slide, imageUrl: imageDataUrl, coverImage: imageDataUrl } // ✅ both cover & image
        : slide
    );

    localStorage.setItem("slides", JSON.stringify(updatedSlides));
    console.log("✅ Saved drawing as cover image:", imageDataUrl.slice(0, 50) + "...");
  } catch (error) {
    console.error("❌ Error saving drawing:", error);
  }
}
  // helper: canvas save/load
  function saveCanvasToStorage(canvas, key) {
    try {
      const dataURL = canvas.toDataURL();
      localStorage.setItem(key, dataURL);
      // notify parent if provided
      if (onSaveDrawing) onSaveDrawing(dataURL, slideId);
      return dataURL;
    } catch (err) {
      console.error("saveCanvasToStorage error:", err);
    }
  }

  function loadCanvasFromStorage(canvas, key) {
    try {
      const saved = localStorage.getItem(key);
      if (saved && canvas) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = saved;
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.error("loadCanvasFromStorage error:", err);
    }
  }

  // initialise canvas and load slide-specific resources
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // set size from props (kept your API)
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctxRef.current = ctx;

    // load saved canvas, ai image, prompt, palette
    loadCanvasFromStorage(canvas, baseKey("drawingBoardCanvas"));
    const savedImage = localStorage.getItem(baseKey("drawingBoardAIImage"));
    const savedPrompt = localStorage.getItem(baseKey("drawingBoardPrompt"));
    const savedPalette = localStorage.getItem(baseKey("drawingBoardPalette"));

    if (savedImage) setAiImage(savedImage);
    if (savedPrompt) setUserPrompt(savedPrompt);
    if (savedPalette) {
      try {
        setAiPalette(JSON.parse(savedPalette));
      } catch { /* ignore */ }
    }

    // ensure undo stack empty for fresh mount
    setUndoStack([]);
    setRedoStack([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, slideId, slideName, width, height]);

  // keep stroke style updated
  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.lineWidth = size;
    ctxRef.current.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  }, [size, color, tool]);

  // persist ai panel open state
  useEffect(() => {
    try {
      localStorage.setItem("drawing_aiPanelOpen", JSON.stringify(aiPanelOpen));
    } catch {}
  }, [aiPanelOpen]);

  // persist aiImage and prompt and palette per slide
  useEffect(() => {
    if (aiImage) localStorage.setItem(baseKey("drawingBoardAIImage"), aiImage);
  }, [aiImage]); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem(baseKey("drawingBoardPrompt"), userPrompt);
  }, [userPrompt]); // eslint-disable-line

  useEffect(() => {
    try {
      localStorage.setItem(baseKey("drawingBoardPalette"), JSON.stringify(aiPalette));
    } catch {}
  }, [aiPalette]); // eslint-disable-line

  // snapshot helpers for undo/redo
  const saveSnapshot = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const data = canvas.toDataURL();
      setUndoStack((s) => {
        const next = [...s, data];
        // Optional: limit stack size
        return next.length > 50 ? next.slice(next.length - 50) : next;
      });
      setRedoStack([]);
    } catch (err) {
      console.error("saveSnapshot error:", err);
    }
  };

  const restoreImage = (dataURL) => {
    if (!dataURL) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleSaveDrawing = () => {
  const imageDataUrl = canvasRef.current.toDataURL("image/png");
  saveImageToList(imageDataUrl);
};

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((r) => [...r, canvasRef.current.toDataURL()]);
    restoreImage(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((u) => [...u, canvasRef.current.toDataURL()]);
    restoreImage(next);
  };

  // drawing handlers
  const startDraw = (e) => {
    if (!ctxRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // store snapshot for undo
    saveSnapshot();
    ctxRef.current.beginPath();

    // get offsetX/Y in canvas coords robustly
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || tool === "text") return;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctxRef.current.lineWidth = size;
    ctxRef.current.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveCanvasToStorage(canvasRef.current, baseKey("drawingBoardCanvas"));
  };

  // text add handler
  const addText = (e) => {
    if (tool !== "text") return;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const text = prompt("Enter text:");
    if (text) {
      const ctx = ctxRef.current;
      ctx.fillStyle = color;
      // scale font by size
      ctx.font = `${Math.max(12, size * 6)}px sans-serif`;
      ctx.fillText(text, offsetX, offsetY);
      saveCanvasToStorage(canvasRef.current, baseKey("drawingBoardCanvas"));
      saveSnapshot();
    }
  };

  // clear canvas
  const handleClear = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, width, height);
    setAiImage(null);
    setAiPalette([]);
    localStorage.removeItem(baseKey("drawingBoardCanvas"));
    localStorage.removeItem(baseKey("drawingBoardAIImage"));
    localStorage.removeItem(baseKey("drawingBoardPrompt"));
    localStorage.removeItem(baseKey("drawingBoardPalette"));
    setUndoStack([]);
    setRedoStack([]);
  };

  // export
  const exportImage = () => {
    try {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.download = `${slideName || "untitled"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("exportImage error:", err);
    }
  };

  // save drawing to gallery list (optional)
  const saveDrawingToList = () => {
    try {
      const dataURL = canvasRef.current.toDataURL("image/png");
      const listKey = baseKey("drawingBoardGallery");
      const existing = JSON.parse(localStorage.getItem(listKey) || "[]");
      const newList = [...existing, dataURL];
      localStorage.setItem(listKey, JSON.stringify(newList));
      alert(`Saved drawing (${newList.length})`);
      if (onSaveDrawing) onSaveDrawing(dataURL, slideId);
    } catch (err) {
      console.error("saveDrawingToList error:", err);
      alert("Failed to save drawing (maybe localStorage quota).");
    }
  };

  // AI: generate image (Pollinations API)
  async function handleAiGenerate() {
    const prompt = userPrompt || "a cool futuristic scene";
    try {
      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
      );
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setAiImage(imageURL);
      localStorage.setItem(baseKey("drawingBoardAIImage"), imageURL);
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI image generation failed.");
    }
  }

  // AI trace (OpenCV) - keep existing logic
  async function handleAiTrace() {
    if (!aiImage || !window.cv) return alert("Load an AI image first!");
    setIsTracing(true);

    const img = new Image();
    img.src = aiImage;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const src = cv.imread(img);
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.Canny(src, dst, 50, 150, 3, false);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;

        for (let y = 0; y < height; y += 2) {
          for (let x = 0; x < width; x += 2) {
            const i = (y * width + x) * 4;
            if (imageData.data[i] > 200) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + Math.random() * 2, y + Math.random() * 2);
              ctx.stroke();
            }
          }
        }

        saveCanvasToStorage(canvas, baseKey("drawingBoardCanvas"));
        src.delete();
        dst.delete();
      } catch (err) {
        console.error("AI trace failed:", err);
        alert("AI trace failed.");
      }
      setIsTracing(false);
    };
  }

  // random palette generator (harmonious-ish)
  function generateRandomPalette() {
    // We'll produce 5 hues around a base hue with varied saturation/lightness
    const baseHue = Math.floor(Math.random() * 360);
    const palette = Array.from({ length: 5 }).map((_, i) => {
      const hue = (baseHue + (i - 2) * 18 + 360) % 360;
      const sat = 50 + Math.floor(Math.random() * 30); // 50-80
      const light = 40 + Math.floor(Math.random() * 30); // 40-70
      return `hsl(${hue} ${sat}% ${light}%)`;
    });
    setAiPalette(palette);
    try {
      localStorage.setItem(baseKey("drawingBoardPalette"), JSON.stringify(palette));
    } catch {}
  }

  // apply palette color
  const applyPaletteColor = (c) => {
    setColor(c);
  };

  // clear AI data (image/prompt/palette)
  const clearAiData = () => {
    setAiImage(null);
    setUserPrompt("");
    setAiPalette([]);
    localStorage.removeItem(baseKey("drawingBoardAIImage"));
    localStorage.removeItem(baseKey("drawingBoardPrompt"));
    localStorage.removeItem(baseKey("drawingBoardPalette"));
  };

  // log for debug - can remove later
  // console.log("🎨 DrawingBoard received:", { slideId, slideName, category });

  // render
  return (
    <div className="drawing-board-outer" style={{ position: "relative" }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="drawing-canvas"
        onMouseDown={(e) => {
          if (tool === "text") return addText(e);
          startDraw(e);
        }}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />

      {/* Toolbar (top-left over canvas) */}
      <div className="drawing-toolbar" style={{
        position: "absolute",
        top: 12,
        left: 12,
        display: "flex",
        gap: 8,
        padding: 8,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 8,
        backdropFilter: "blur(6px)",
        zIndex: 1000
      }}>
        <button onClick={() => setTool("brush")} className={tool === "brush" ? "active": ""}>🖌 Brush</button>
        <button onClick={() => setTool("eraser")} className={tool === "eraser" ? "active": ""}>🧽 Eraser</button>
        <button onClick={() => setTool("text")} className={tool === "text" ? "active": ""}>🔤 Text</button>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="range" min="1" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>

        <button onClick={handleUndo}>↩️ Undo</button>
        <button onClick={handleRedo}>↪️ Redo</button>
        <button onClick={handleClear}>🧹 Clear</button>

        <button onClick={saveDrawingToList}>💾 Save</button>
        <button onClick={exportImage}>📤 Export</button>
        

      </div>

      {/* floating AI Tools toggle button (bottom-right) */}
      <button
        aria-label="AI Tools"
        title="AI Tools"
        onClick={() => setAiPanelOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 20000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#0b74ff",
          color: "#fff",
          border: "none",
          boxShadow: "0 6px 20px rgba(11,116,255,0.25)",
          cursor: "pointer",
          fontSize: 22,
        }}
      >
        🧠
      </button>

      {/* Floating AI side panel (slides in from right) */}
      <div
        className="ai-panel"
        style={{
          position: "fixed",
          top: 60,
          right: aiPanelOpen ? 18 : -360,
          width: 340,
          height: "70vh",
          zIndex: 19999,
          background: "rgba(255,255,255,0.98)",
          color: "#111",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          transition: "right 280ms ease",
          overflow: "auto",
          padding: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>AI Tools</h3>
          <button onClick={() => setAiPanelOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✖</button>
        </div>

        {/* Prompt */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 12, color: "#444" }}>Prompt</label>
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Describe (optional) — e.g. 'sunset city'"
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>

        {/* AI image controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={handleAiGenerate} style={{ flex: 1 }}>🖼 Generate</button>
          <button onClick={() => { if (aiImage) window.open(aiImage, "_blank"); }} disabled={!aiImage} style={{ flex: 1 }}>🔍 Open</button>
        </div>

        

        {/* AI trace */}
        <div style={{ marginBottom: 10 }}>
          <button onClick={handleAiTrace} disabled={!aiImage || isTracing} style={{ width: "100%" }}>
            {isTracing ? "Tracing..." : "✏️ Trace"}
          </button>
        </div>

        {/* Palette generator */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Random Palette</strong>
            <button onClick={generateRandomPalette} style={{ fontSize: 12 }}>🎲</button>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {aiPalette.length === 0 && <div style={{ color: "#777" }}>No palette yet — generate one.</div>}
            {aiPalette.map((c, i) => (
              <div
                key={i}
                onClick={() => applyPaletteColor(c)}
                title={`Use ${c}`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: c,
                  cursor: "pointer",
                  border: c === color ? "3px solid #000000" : "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </div>

        {/* AI preview */}
        {aiImage && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "#444" }}>AI Result</div>
            <img src={aiImage} alt="AI" style={{ width: "100%", borderRadius: 8, marginTop: 8 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => {
                // draw image onto canvas centered
                const canvas = canvasRef.current;
                const ctx = ctxRef.current;
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = aiImage;
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  saveCanvasToStorage(canvas, baseKey("drawingBoardCanvas"));
                };
              }}>🖼 Place</button>
              <button onClick={() => {
                navigator.clipboard?.writeText(aiImage);
                alert("AI image URL copied to clipboard (blob URL).");
              }}>🔗 Copy URL</button>
              <button onClick={() => { setAiImage(null); localStorage.removeItem(baseKey("drawingBoardAIImage")); }}>🗑 Clear</button>
            </div>
          </div>
        )}

        <div style={{ borderTop: "1px solid #eee", paddingTop: 8, marginTop: 8 }}>
          <button onClick={clearAiData} style={{ width: "100%" }}>🧹 Clear AI Data</button>
        </div>
      </div>

      {/* Small on-canvas label of current slide (optional) */}
      <div style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 12,
        zIndex: 1000
      }}>
        {slideName || slideId}
      </div>
    </div>
  );
}
