import { useState } from "react";
import { useAI } from "../storyboard-component/AIContext";
import "../styles/FloatingAIPanel.css";

export default function AIPanel() {
  const { messages, sendToAI, isLoading } = useAI();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;
    sendToAI(input);
    setInput("");
  };

  return (
    <div className={`ai-panel ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "💬"}
      </button>

      {isOpen && (
        <div className="panel-body">
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="msg assistant">⏳ Thinking...</div>}
          </div>

          <div className="ai-helper">
            <p>💡 Need help? Ask AI for ideas or guidance.</p>
            <input type="text" placeholder="Ask AI for help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
