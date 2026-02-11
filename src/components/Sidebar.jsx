import { logout } from "../auth/AuthUtils";

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) {
  return (
    <div className="sidebar">
      <h2>🧘 Prakruti AI</h2>

      <button className="new-chat" onClick={onNewChat}>
        + New Chat
      </button>

      <button className="new-chat" onClick={logout}>
        Logout
      </button>

      <div className="sidebar-section">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
