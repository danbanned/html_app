// src/components/ChatPanel.jsx
import { useState } from "react";
import { useChatCompletion } from "../hooks/useChatCompletion";

export default function ChatPanel({ bookContext }) {
  const [messages, setMessages] = useState([]); // [{role, content}]
  const chat = useChatCompletion();

  const submitUserMessage = async (text) => {
    if (!text) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);

    try {
      const res = await chat.mutateAsync({ messages: nextMessages, bookContext });
      const assistantReply = res.reply ?? "";
      setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Assistant unavailable." }]);
    }
  };

  return (
    <div className="chat-panel" aria-live="polite">
      <ul className="chat-messages">
        {messages.map((m, i) => (
          <li key={i} className={`msg msg--${m.role}`}>
            <strong>{m.role === "user" ? "You" : "Assistant"}: </strong>
            <span>{m.content}</span>
          </li>
        ))}
        {chat.isLoading && <li className="msg msg--assistant">Typing…</li>}
      </ul>

      <form onSubmit={(e) => {
        e.preventDefault();
        const t = e.currentTarget.elements.prompt.value?.trim();
        e.currentTarget.reset();
        submitUserMessage(t);
      }}>
        <input name="prompt" placeholder="Ask about this book (plot, themes, reading tips)..." required />
        <button type="submit" disabled={chat.isLoading}>Send</button>
      </form>
    </div>
  );
}
