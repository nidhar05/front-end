import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";
export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Load from Backend
  useEffect(() => {
    // fetch(`${import.meta.env.VITE_API_URL}/api/chat/sessions` || "http://localhost:8080/api/chat/sessions")


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
      });
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    fetch(`http://localhost:8080/api/chat/sessions/${activeChatId}`)
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
      });
  }, [activeChatId]);

  const startNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Prakruti Assessment",
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

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

  // 🗑️ DELETE CHAT
  const deleteChat = (chatId) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);

      // If deleted chat was active
      if (chatId === activeChatId) {
        setActiveChatId(updated.length > 0 ? updated[0].id : null);
      }

      return updated;
    });
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={startNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={deleteChat}
      />

      <ChatWindow
        key={activeChatId}
        chat={activeChat}
        chatId={activeChatId}
        onUpdateMessages={(chatId, msgs) => updateMessages(chatId, msgs)}
      />
    </div>
  );
}
