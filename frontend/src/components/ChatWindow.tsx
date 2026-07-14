import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { streamChat } from "../api";
import type { ConversationDetail, Message } from "../types";

interface Props {
  conversation: ConversationDetail | null;
  onMessageSent: () => void;
}

export default function ChatWindow({ conversation, onMessageSent }: Props) {
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, streamingText]);

  if (!conversation) {
    return <div className="chat-window empty">Select or start a new chat</div>;
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const content = input;
    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    await streamChat(
      conversation.id,
      content,
      (token) => setStreamingText((prev) => prev + token),
      () => {
        setIsStreaming(false);
        setStreamingText("");
        onMessageSent();
      },
      (err) => {
        setIsStreaming(false);
        setStreamingText("Error: " + err);
      }
    );
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {conversation.messages.map((m: Message) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isStreaming && (
          <MessageBubble
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingText || "...",
              created_at: new Date().toISOString(),
            }}
          />
        )}
        <div ref={bottomRef} />
      </div>
      <div className="input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message the model..."
          disabled={isStreaming}
        />
        <button onClick={handleSend} disabled={isStreaming || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
