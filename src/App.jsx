import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Load sessions
  useEffect(() => {
    fetch(`${API_BASE}/api/chat/sessions`)
      .then(res => res.json())
      .then(sessionIds => {
        const mapped = sessionIds.map(id => ({
          id,
          title: "Prakruti Assessment",
          messages: []
        }));
        setChats(mapped);
        if (mapped.length > 0) setActiveChatId(mapped[0].id);
      })
      .catch(console.error);
  }, []);

  // Load messages when chat selected
  useEffect(() => {
    if (!activeChatId) return;

    fetch(`${API_BASE}/api/chat/sessions/${activeChatId}`)
      .then(res => res.json())
      .then(messages => {
        setChats(prev =>
          prev.map(c =>
            c.id === activeChatId
              ? {
                ...c,
                messages: messages.map(m => ({
                  role: m.role.toLowerCase(),
                  text: m.message
                }))
              }
              : c
          )
        );
      })
      .catch(console.error);
  }, [activeChatId]);

  // New chat
  const startNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Prakruti Assessment",
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // Update messages
  const updateMessages = (chatId, messages) => {
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
            ...c,
            messages,
            title:
              messages.find(m => m.role === "user")?.text?.slice(0, 25) ||
              "Prakruti Assessment"
          }
          : c
      )
    );
  };

  // Select chat
  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // 🗑️ DELETE CHAT (FIXED)
  const handleDeleteChat = async (sessionId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/sessions/${sessionId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // ✅ update UI ONLY after backend delete
      setChats(prev => prev.filter(c => c.id !== sessionId));

      if (activeChatId === sessionId) {
        setActiveChatId(null);
      }

    } catch (err) {
      console.error("Failed to delete chat", err);
      alert("Delete failed on server");
    }
  };



  const activeChat = chats.find(c => c.id === activeChatId);

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
