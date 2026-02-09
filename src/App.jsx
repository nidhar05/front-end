import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // =========================
  // LOAD CHAT SESSIONS
  // =========================
  const loadSessions = () => {
    fetch(`${API_BASE}/api/chat/sessions`)
      .then(res => res.json())
      .then(sessions => {
        const mapped = sessions.map(s => ({
          id: s.id,
          title: s.title,
          messages: []
        }));

        setChats(mapped);

        if (!activeChatId && mapped.length > 0) {
          setActiveChatId(mapped[0].id);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSessions();
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
  // NEW CHAT
  // =========================
  const startNewChat = () => {
    const newId = crypto.randomUUID();

    setChats(prev => [
      {
        id: newId,
        title: "New Prakruti Assessment",
        messages: []
      },
      ...prev
    ]);

    setActiveChatId(newId);
  };

  // =========================
  // UPDATE MESSAGES (MOVE TO TOP)
  // =========================
  const updateMessages = (chatId, messages) => {
    setChats(prev => {
      const updated = prev.find(c => c.id === chatId);
      if (!updated) return prev;

      const updatedChat = {
        ...updated,
        messages,
        title:
          messages.find(m => m.role === "user")?.text?.slice(0, 25) ||
          updated.title
      };

      return [
        updatedChat,
        ...prev.filter(c => c.id !== chatId)
      ];
    });
  };

  // =========================
  // RENAME CHAT
  // =========================
  const handleRenameChat = async (chatId) => {
    const newTitle = prompt("Rename chat");
    if (!newTitle) return;

    // frontend update
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: newTitle }
          : chat
      )
    );

    // backend update
    await fetch(
      `${API_BASE}/api/chat/sessions/${chatId}/rename`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      }
    );
  };

  // =========================
  // DELETE CHAT
  // =========================
  const handleDeleteChat = async (chatId) => {
    await fetch(
      `${API_BASE}/api/chat/sessions/${chatId}`,
      { method: "DELETE" }
    );

    setChats(prev => prev.filter(chat => chat.id !== chatId));

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={startNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
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
