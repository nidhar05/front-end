import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { logout } from "./auth/AuthUtils";
import "./App.css";

const API_BASE = "http://localhost:8080";

export default function AppContent() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  // =============================
  // INITIAL LOAD (ON REFRESH)
  // =============================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login", { replace: true });
    } else {
      setToken(storedToken);
      loadSessions();
    }
  }, []);

  // =============================
  // LOAD SESSIONS
  // =============================
  const loadSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (res.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      const sessions = await res.json();

      const sorted = sessions.sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );

      const mapped = sorted.map(s => ({
        id: s.sessionId,
        title: s.title,
        messages: []
      }));

      setChats(mapped);

      if (mapped.length > 0) {
        setActiveChatId(prev => {
          const exists = mapped.find(c => c.id === prev);
          return exists ? prev : mapped[0].id;
        });
      }

    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  // =============================
  // LOAD MESSAGES
  // =============================
  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/chat/sessions/${activeChatId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!res.ok) {
          console.error("Failed to load messages:", res.status);
          return;
        }

        const messages = await res.json();

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

      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();

  }, [activeChatId]);

  // =============================
  // NEW CHAT
  // =============================
  const startNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const session = await res.json();

      const newChat = {
        id: session.sessionId,
        title: session.title,
        messages: []
      };

      setChats(prev => [newChat, ...prev]);
      setActiveChatId(session.sessionId);

    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  // =============================
  // UPDATE MESSAGES
  // =============================
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

  // =============================
  // RENAME CHAT
  // =============================
  const handleRenameChat = async (chatId) => {
    const newTitle = prompt("Rename chat");
    if (!newTitle || newTitle.trim() === "") return;

    try {
      const res = await fetch(
        `${API_BASE}/api/chat/sessions/${chatId}/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ title: newTitle })
        }
      );

      if (!res.ok) return;

      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { ...chat, title: newTitle }
            : chat
        )
      );

    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  // =============================
  // DELETE CHAT
  // =============================
  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/sessions/${chatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) return;

      setChats(prev => {
        const updated = prev.filter(chat => chat.id !== chatId);

        if (chatId === activeChatId) {
          setActiveChatId(updated.length > 0 ? updated[0].id : null);
        }

        return updated;
      });

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const activeChat =
    chats.find(c => c.id === activeChatId) || null;

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

      {activeChatId && activeChat && (
        <ChatWindow
          key={activeChatId}
          chat={activeChat}
          chatId={activeChatId}
          onUpdateMessages={updateMessages}
        />
      )}
    </div>
  );
}
