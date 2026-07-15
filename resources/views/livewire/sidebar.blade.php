<aside class="sidebar">
    <button wire:click="newChat" class="new-chat-btn">+ New Chat</button>

    <ul class="conversation-list">
        @foreach($conversations as $conversation)
            <li
                wire:click="select('{{ $conversation->id }}')"
                wire:key="convo-{{ $conversation->id }}"
                class="conversation-item {{ $activeId === $conversation->id ? 'active' : '' }}"
            >
                <span class="conversation-title">{{ $conversation->title }}</span>
                <button
                    wire:click.stop="delete('{{ $conversation->id }}')"
                    class="delete-btn"
                    type="button"
                >&times;</button>
            </li>
        @endforeach
    </ul>
</aside>
