import { logout } from "../auth/AuthUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <h2>🧘 Prakruti AI</h2>

      <button className="new-chat" onClick={onNewChat}>
        + New Chat
      </button>

      <button className="new-chat" onClick={handleLogout}>
        Logout
      </button>

      <div className="sidebar-section">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
          >
            <span onClick={() => onSelectChat(chat.id)}>
              {chat.title}
            </span>

            <div className="chat-actions">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === chat.id ? null : chat.id)
                }
              >
                ⋮
              </button>

              {openMenu === chat.id && (
                <div className="dropdown">
                  <div onClick={() => {
                    onRenameChat(chat.id);
                    setOpenMenu(null);
                  }}>
                    Rename
                  </div>

                  <div onClick={() => {
                    onDeleteChat(chat.id);
                    setOpenMenu(null);
                  }}>
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
