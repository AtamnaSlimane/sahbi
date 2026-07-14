import json
from collections.abc import AsyncGenerator

import httpx

from app.core.config import settings


class OllamaService:
    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings.ollama_base_url

    async def list_models(self) -> list[dict]:
        async with httpx.AsyncClient(base_url=self.base_url, timeout=10.0) as client:
            resp = await client.get("/api/tags")
            resp.raise_for_status()
            data = resp.json()
            return data.get("models", [])

    async def stream_chat(
        self, model: str, messages: list[dict]
    ) -> AsyncGenerator[str, None]:
        """Stream assistant tokens from Ollama's /api/chat endpoint."""
        payload = {"model": model, "messages": messages, "stream": True}
        async with httpx.AsyncClient(base_url=self.base_url, timeout=None) as client:
            async with client.stream("POST", "/api/chat", json=payload) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    chunk = json.loads(line)
                    if chunk.get("done"):
                        break
                    token = chunk.get("message", {}).get("content", "")
                    if token:
                        yield token


ollama_service = OllamaService()
