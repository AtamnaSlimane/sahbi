<<<<<<< HEAD
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# sahbi
# sahbi
=======
# Local Ollama Chat

A local ChatGPT/Claude-style webapp powered by your own Ollama models.

- **Backend**: FastAPI, proxies to Ollama, stores conversations/messages in SQLite (SQLAlchemy)
- **Frontend**: React + Vite + TS, sidebar with chat history, model switcher, markdown/code rendering, streamed responses

## 1. Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate      # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

This creates `chat.db` (SQLite) in `backend/` on first run automatically.

Make sure Ollama is running (`ollama serve`, or it's already running as a service) — the
backend expects it at `http://localhost:11434` by default. You can override with a `.env`
file in `backend/`:

```
OLLAMA_BASE_URL=http://localhost:11434
DATABASE_URL=sqlite:///./chat.db
CORS_ORIGINS=["http://localhost:5173"]
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## How it works

- `GET /api/models` — lists locally pulled Ollama models (`ollama list` equivalent)
- `GET/POST/PATCH/DELETE /api/conversations` — CRUD for chats, persisted to SQLite
- `POST /api/chat/stream` — sends a message, streams the assistant's reply back over
  Server-Sent Events as it's generated by Ollama, then saves the full reply to the DB

The frontend keeps an active conversation in state, appends streamed tokens live as they
arrive, and re-fetches the conversation once streaming finishes so the persisted message
(with its real ID and timestamp) replaces the live-streamed placeholder.

## Notes / next steps you might want

- Add a "stop generating" button (cancel the fetch reader)
- Add system prompt / temperature controls per conversation
- Switch SQLite -> Postgres if you want this multi-user later
- Add auth if you ever expose this beyond localhost
>>>>>>> 166c845c83d285abb69f242c8103896c829be2d8
# sahbi
# sahbi
