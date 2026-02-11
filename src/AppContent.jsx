import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE = "http://localhost:8080";

export default function AppContent() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  // LOAD SESSIONS
  const loadSessions = () => {
    fetch(`${API_BASE}/api/chat/sessions`, {
      headers: authHeaders
    })
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
      });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // LOAD MESSAGES
  useEffect(() => {
    if (!activeChatId) return;

    fetch(`${API_BASE}/api/chat/sessions/${activeChatId}`, {
      headers: authHeaders
    })
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
      });
  }, [activeChatId]);

  // NEW CHAT
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

  // UPDATE MESSAGES
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

  // RENAME
  const handleRenameChat = async (chatId) => {
    const newTitle = prompt("Rename chat");
    if (!newTitle) return;

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: newTitle }
          : chat
      )
    );

    await fetch(
      `${API_BASE}/api/chat/sessions/${chatId}/rename`,
      {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ title: newTitle })
      }
    );
  };

  // DELETE
  const handleDeleteChat = async (chatId) => {
    await fetch(
      `${API_BASE}/api/chat/sessions/${chatId}`,
      {
        method: "DELETE",
        headers: authHeaders
      }
    );

    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
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
