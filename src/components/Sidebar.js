export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat
}) {
  return (
    <div className="sidebar">
      <h2>🧘 Prakruti AI</h2>

      <button className="new-chat" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="sidebar-section">
        <p className="section-title">Chats</p>

        {chats.length === 0 && (
          <p className="chat-placeholder">No history yet</p>
        )}

        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${
              chat.id === activeChatId ? "active" : ""
            }`}
          >
            {/* Chat title */}
            <span
              className="chat-title"
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </span>

            {/* Delete button */}
            <span
              className="delete-chat"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              title="Delete chat"
            >
              🗑️
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
