import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ModelSelector from "./components/ModelSelector";
import ChatWindow from "./components/ChatWindow";
import {
  fetchModels,
  fetchConversations,
  fetchConversation,
  createConversation,
  deleteConversation,
  updateConversation,
} from "./api";
import type { Conversation, ConversationDetail, OllamaModel } from "./types";
import "./App.css";

export default function App() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<ConversationDetail | null>(null);
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    fetchModels()
      .then((m) => {
        setModels(m);
        if (m.length && !selectedModel) setSelectedModel(m[0].name);
      })
      .catch(console.error);
    fetchConversations().then(setConversations).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshConversations = () => {
    fetchConversations().then(setConversations).catch(console.error);
  };

  const handleSelect = async (id: string) => {
    const detail = await fetchConversation(id);
    setActiveConvo(detail);
    setSelectedModel(detail.model);
  };

  const handleNew = async () => {
    if (!selectedModel) return;
    const convo = await createConversation(selectedModel);
    refreshConversations();
    handleSelect(convo.id);
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    if (activeConvo?.id === id) setActiveConvo(null);
    refreshConversations();
  };

  const handleModelChange = async (model: string) => {
    setSelectedModel(model);
    if (activeConvo) {
      await updateConversation(activeConvo.id, { model });
      handleSelect(activeConvo.id);
    }
  };

  const handleMessageSent = () => {
    if (activeConvo) handleSelect(activeConvo.id);
    refreshConversations();
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeConvo?.id ?? null}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <div className="main-panel">
        <div className="top-bar">
          <ModelSelector
            models={models}
            selected={selectedModel}
            onChange={handleModelChange}
          />
        </div>
        <ChatWindow conversation={activeConvo} onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
}
