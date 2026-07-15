<?php

namespace App\Livewire;

use App\Models\Conversation;
use App\Models\Message;
use App\Services\OllamaService;
use Illuminate\Support\Str;
use Livewire\Attributes\On;
use Livewire\Component;

class ChatWindow extends Component
{
    public ?string $conversationId = null;
    public string $input = '';
    public array $models = [];
    public string $selectedModel = '';

    public function mount(): void
    {
        $this->models = app(OllamaService::class)->listModels();
        $this->selectedModel = $this->models[0]['name'] ?? '';
    }

    #[On('conversation-selected')]
    public function loadConversation(?string $id): void
    {
        $this->conversationId = $id;

        if ($id) {
            $this->selectedModel = Conversation::find($id)?->model ?? $this->selectedModel;
        }
    }

    public function updatedSelectedModel(string $value): void
    {
        if ($this->conversationId) {
            Conversation::where('id', $this->conversationId)->update(['model' => $value]);
        }
    }

    public function getConversationProperty(): ?Conversation
    {
        return $this->conversationId
            ? Conversation::with('messages')->find($this->conversationId)
            : null;
    }

    public function send(): void
    {
        if (trim($this->input) === '') {
            return;
        }

        // Auto-create a conversation if none is active yet.
        if (! $this->conversationId) {
            $conversation = Conversation::create(['model' => $this->selectedModel]);
            $this->conversationId = $conversation->id;
            $this->dispatch('conversation-selected', id: $conversation->id);
        }

        $conversation = Conversation::findOrFail($this->conversationId);

        $userContent = $this->input;
        $this->input = '';

        Message::create([
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $userContent,
        ]);

        if ($conversation->title === 'New Chat') {
            $conversation->update(['title' => Str::limit($userContent, 50)]);
        }

        $history = $conversation->messages()
            ->get(['role', 'content'])
            ->map(fn ($m) => ['role' => $m->role, 'content' => $m->content])
            ->all();

        $full = '';

        foreach (app(OllamaService::class)->streamChat($conversation->model, $history) as $token) {
            $full .= $token;
            $this->stream(to: 'assistant-reply', content: $token);
        }

        Message::create([
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $full,
        ]);

        $this->dispatch('conversation-saved');
    }

    public function render()
    {
        return view('livewire.chat-window', [
            'conversation' => $this->conversation,
        ]);
    }
}
