<?php

namespace App\Services;

use Generator;
use Illuminate\Support\Facades\Http;

class OllamaService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.base_url', 'http://localhost:11434');
    }

    public function listModels(): array
    {
        $response = Http::get("{$this->baseUrl}/api/tags");
        $response->throw();

        return $response->json('models', []);
    }

    /**
     * Stream tokens from Ollama's /api/chat endpoint as they're generated.
     *
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return Generator<string>
     */
    public function streamChat(string $model, array $messages): Generator
    {
        $response = Http::withOptions(['stream' => true])
            ->timeout(0)
            ->post("{$this->baseUrl}/api/chat", [
                'model' => $model,
                'messages' => $messages,
                'stream' => true,
            ]);

        $body = $response->toPsrResponse()->getBody();
        $buffer = '';

        while (! $body->eof()) {
            $buffer .= $body->read(1024);

            while (($pos = strpos($buffer, "\n")) !== false) {
                $line = trim(substr($buffer, 0, $pos));
                $buffer = substr($buffer, $pos + 1);

                if ($line === '') {
                    continue;
                }

                $chunk = json_decode($line, true);

                if (! $chunk) {
                    continue;
                }

                if (! empty($chunk['done'])) {
                    return;
                }

                $token = $chunk['message']['content'] ?? '';

                if ($token !== '') {
                    yield $token;
                }
            }
        }
    }
}
