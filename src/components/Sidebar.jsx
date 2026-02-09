import { useState, useRef } from "react";

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) {
  const [menu, setMenu] = useState(null); 
  // menu = { chatId, top }

  return (
    <div className="sidebar">
      <h2>🧘 Prakruti AI</h2>

      <button className="new-chat" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="sidebar-section">
        <p className="section-title">Chats</p>

        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${
              chat.id === activeChatId ? "active" : ""
            }`}
          >
            <span
              className="chat-title"
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </span>

            <span
              className="three-dots"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMenu({
                  chatId: chat.id,
                  top: rect.top
                });
              }}
            >
              ⋮
            </span>
          </div>
        ))}
      </div>

      {/* FLOATING MENU (OUTSIDE SCROLL AREA) */}
      {menu && (
        <div
          className="chat-menu floating"
          style={{ top: menu.top }}
        >
          <div
            onClick={() => {
              onRenameChat(menu.chatId);
              setMenu(null);
            }}
          >
            Rename
          </div>
          <div
            className="delete"
            onClick={() => {
              onDeleteChat(menu.chatId);
              setMenu(null);
            }}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
}
