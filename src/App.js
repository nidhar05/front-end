import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("prakruti-chats")) || [];
    setChats(saved);
    if (saved.length > 0) setActiveChatId(saved[0].id);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("prakruti-chats", JSON.stringify(chats));
  }, [chats]);

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
        chat={activeChat}
        onUpdateMessages={msgs =>
          activeChat && updateMessages(activeChatId, msgs)
        }
      />
    </div>
  );
}
