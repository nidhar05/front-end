import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // =========================
  // LOAD ALL CHAT SESSIONS
  // =========================
  useEffect(() => {
    fetch(`${API_BASE}/api/chat/sessions`)
      .then(res => res.json())
      .then(sessionIds => {
        const mapped = sessionIds
          .map(id => ({
            id,
            title: "Prakruti Assessment",
            messages: []
          }))
          // 🔥 ENSURE NEWEST CHAT IS ALWAYS ON TOP
          .sort((a, b) => Number(b.id) - Number(a.id));

        setChats(mapped);
        if (mapped.length > 0) {
          setActiveChatId(mapped[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // =========================
  // LOAD MESSAGES FOR ACTIVE CHAT
  // =========================
  useEffect(() => {
    if (!activeChatId) return;

    fetch(`${API_BASE}/api/chat/sessions/${activeChatId}`)
      .then(res => res.json())
      .then(messages => {
        setChats(prev =>
          prev.map(chat =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: messages.map(m => ({
                    role: m.role.toLowerCase(),
                    text: m.message
                  }))
                }
              : chat
          )
        );
      })
      .catch(console.error);
  }, [activeChatId]);

  // =========================
  // CREATE NEW CHAT (TOP)
  // =========================
  const startNewChat = () => {
    const newChat = {
      id: Date.now().toString(), // timestamp
      title: "New Prakruti Assessment",
      messages: []
    };

    // 🔥 ALWAYS ADD NEW CHAT AT TOP
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // =========================
  // UPDATE MESSAGES
  // =========================
  const updateMessages = (chatId, messages) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages,
              title:
                messages.find(m => m.role === "user")?.text?.slice(0, 25) ||
                "Prakruti Assessment"
            }
          : chat
      )
    );
  };

  // =========================
  // SELECT CHAT
  // =========================
  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // =========================
  // DELETE CHAT (PERMANENT)
  // =========================
  const handleDeleteChat = async (sessionId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/sessions/${sessionId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setChats(prev => prev.filter(chat => chat.id !== sessionId));

      if (activeChatId === sessionId) {
        setActiveChatId(null);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onDeleteChat={handleDeleteChat}
      />

      <ChatWindow
        key={activeChatId}
        chat={activeChat}
        chatId={activeChatId}
        onUpdateMessages={updateMessages}
      />
    </div>
  );
}
