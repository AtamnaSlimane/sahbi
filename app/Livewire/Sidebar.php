<?php

namespace App\Livewire;

use App\Models\Conversation;
use App\Services\OllamaService;
use Livewire\Attributes\On;
use Livewire\Component;

class Sidebar extends Component
{
    public ?string $activeId = null;

    #[On('conversation-selected')]
    public function setActive(?string $id = null): void
    {
        $this->activeId = $id;
    }

    #[On('conversation-saved')]
    public function refresh(): void
    {
        // no-op: render() below re-queries conversations on every event
    }

    public function newChat(): void
    {
        $defaultModel = app(OllamaService::class)->listModels()[0]['name'] ?? 'llama3';

        $conversation = Conversation::create(['model' => $defaultModel]);

        $this->select($conversation->id);
    }

    public function select(string $id): void
    {
        $this->activeId = $id;
        $this->dispatch('conversation-selected', id: $id);
    }

    public function delete(string $id): void
    {
        Conversation::destroy($id);

        if ($this->activeId === $id) {
            $this->activeId = null;
            $this->dispatch('conversation-selected', id: null);
        }
    }

    public function render()
    {
        return view('livewire.sidebar', [
            'conversations' => Conversation::orderByDesc('updated_at')->get(),
        ]);
    }
}
