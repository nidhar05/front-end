import { logout } from "../auth/AuthUtils";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // remove token
    navigate("/login", { replace: true }); // go to login page
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
            key={String(chat.id)}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
            onClick={() => {
              if (chat.id !== activeChatId) {
                onSelectChat(chat.id);
              } else {
                // force reload if same chat clicked
                onSelectChat(null);
                setTimeout(() => onSelectChat(chat.id), 0);
              }
            }}

          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
