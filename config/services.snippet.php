<?php

// Add this array entry inside the array returned by config/services.php
// (the file created by `laravel new`), alongside 'mailgun', 'postmark', etc.

return [

    // ...existing entries (mailgun, postmark, resend, slack, etc.)...

    'ollama' => [
        'base_url' => env('OLLAMA_BASE_URL', 'http://localhost:11434'),
    ],

];
