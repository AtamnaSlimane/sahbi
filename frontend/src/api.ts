import type { Conversation, ConversationDetail, OllamaModel } from "./types";

const BASE_URL = "http://localhost:8000/api";

export async function fetchModels(): Promise<OllamaModel[]> {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error("Failed to fetch models");
  const data = await res.json();
  return data.models;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE_URL}/conversations`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function fetchConversation(id: string): Promise<ConversationDetail> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

export async function createConversation(
  model: string,
  title?: string
): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function updateConversation(
  id: string,
  payload: { title?: string; model?: string }
): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update conversation");
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete conversation");
}

export async function streamChat(
  conversationId: string,
  content: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): Promise<void> {
  const res = await fetch(`${BASE_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId, content }),
  });

  if (!res.ok || !res.body) {
    onError("Failed to reach server");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      const jsonStr = part.slice(6);
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.token) onToken(parsed.token);
        if (parsed.error) onError(parsed.error);
        if (parsed.done) onDone();
      } catch {
        // ignore malformed chunk
      }
    }
  }
}
