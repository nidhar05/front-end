import { useEffect, useRef, useState } from "react";
import Message from "./Message";

const BACKEND_URL = "http://localhost:8080/api/chat";

export default function ChatWindow({ chat, chatId, onUpdateMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, loading]);

  useEffect(() => {
    if (chat && !loading) {
      inputRef.current?.focus();
    }
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !chat || loading) return;

    const userMsg = { role: "user", text: input };
    const updatedMessages = [...chat.messages, userMsg];
    onUpdateMessages(chatId, updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: chatId,   // 🔑 THIS IS THE KEY FIX
          message: userMsg.text
        })
      });


      const data = await res.json();

      onUpdateMessages(chatId, [
        ...updatedMessages,
        { role: "assistant", text: data.reply }
      ]);
    } catch {
      onUpdateMessages(chatId, [
        ...updatedMessages,
        {
          role: "assistant",
          text: "⚠️ Unable to process your request. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-container">
      {/* TOP TITLE BAR */}
      <header className="chat-header">
        <h3>Prakruti Assessment Chatbot</h3>
      </header>

      {/* CHAT BODY */}
      <main className="chat-body">
        {!chat || chat.messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start a new Prakruti assessment</h2>
            <p>Describe your symptoms to begin.</p>
          </div>
        ) : (
          chat.messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} />
          ))
        )}

        {/* PROCESSING INDICATOR */}
        {loading && (
          <div className="message-row assistant">
            <div className="message-bubble processing">
              <span className="spinner"></span>
              Processing…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* INPUT BAR (ALWAYS VISIBLE) */}
      <footer className="chat-input">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={chat ? "Type your message here…" : "Click 'New Chat' to start"}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={!chat || loading}
          type="text"
        />
        <button onClick={sendMessage} disabled={!chat || loading} title="Send message (or press Enter)">
          Send
        </button>
      </footer>
    </div>
  );
}
