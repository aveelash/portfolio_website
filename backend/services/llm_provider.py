import os
from abc import ABC, abstractmethod

import requests


class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_answer(self, prompt: str) -> str:
        pass


class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")

        self.model = os.environ.get("GEMINI_MODEL")

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is missing in backend/.env")

    def generate_answer(self, prompt: str) -> str:

        print(self.api_key)
        print(self.model)
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent?key={self.api_key}"
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1200,
            },
        }

        response = requests.post(url, json=payload, timeout=30)

        if not response.ok:
            print("Gemini API error status:", response.status_code)
            print("Gemini API error body:", response.text)
            response.raise_for_status()

        data = response.json()

        candidates = data.get("candidates", [])
        if not candidates:
            return "I could not generate an answer right now."

        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return "I could not generate an answer right now."

        return parts[0].get("text", "").strip()


class ClaudeProvider(BaseLLMProvider):
    def generate_answer(self, prompt: str) -> str:
        raise NotImplementedError("ClaudeProvider is not implemented yet.")


def get_llm_provider() -> BaseLLMProvider:
    provider = os.environ.get("LLM_PROVIDER", "gemini").lower()

    if provider == "gemini":
        return GeminiProvider()

    if provider == "claude":
        return ClaudeProvider()

    raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")
