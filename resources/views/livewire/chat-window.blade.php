<div class="chat-window" x-data>
    @if(! $conversation)
        <div class="messages empty-state">Select or start a new chat</div>
    @else
        <div
            class="messages"
            x-init="$el.scrollTop = $el.scrollHeight"
            x-on:livewire:updated="$el.scrollTop = $el.scrollHeight"
        >
            @foreach($conversation->messages as $message)
                <div class="message-bubble {{ $message->role }}" wire:key="msg-{{ $message->id }}">
                    <div class="message-role">{{ $message->role === 'user' ? 'You' : 'Assistant' }}</div>
                    <div class="message-content">{!! Illuminate\Support\Str::markdown($message->content) !!}</div>
                </div>
            @endforeach

            <div class="message-bubble assistant" wire:loading wire:target="send">
                <div class="message-role">Assistant</div>
                <div class="message-content" wire:stream="assistant-reply"></div>
            </div>
        </div>
    @endif

    <form wire:submit="send" class="input-bar">
        <select wire:model.live="selectedModel" class="model-selector">
            @foreach($models as $model)
                <option value="{{ $model['name'] }}">{{ $model['name'] }}</option>
            @endforeach
        </select>
        <textarea
            wire:model="input"
            placeholder="Message the model..."
            wire:keydown.enter.prevent="send"
        ></textarea>
        <button type="submit" wire:loading.attr="disabled" wire:target="send">Send</button>
    </form>
</div>
