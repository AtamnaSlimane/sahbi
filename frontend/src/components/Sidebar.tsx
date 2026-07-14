import type { Conversation } from "../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={onNew}>
        + New Chat
      </button>
      <ul className="conversation-list">
        {conversations.map((c) => (
          <li
            key={c.id}
            className={
              c.id === activeId ? "conversation-item active" : "conversation-item"
            }
            onClick={() => onSelect(c.id)}
          >
            <span className="conversation-title">{c.title}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
