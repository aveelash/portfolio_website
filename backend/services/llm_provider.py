import os
import time
from abc import ABC, abstractmethod

import requests


class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_answer(self, prompt: str) -> str:
        pass


class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is missing")

    def generate_answer(self, prompt: str) -> str:
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

        last_error = None

        for attempt in range(3):
            try:
                response = requests.post(url, json=payload, timeout=45)

                if response.status_code == 503:
                    last_error = response.text
                    time.sleep(2 + attempt * 2)
                    continue

                if response.status_code == 429:
                    raise RuntimeError(
                        "Gemini is rate-limiting requests right now. Please try again later."
                    )

                if not response.ok:
                    raise RuntimeError(
                        f"Gemini API failed with status {response.status_code}: {response.text}"
                    )

                data = response.json()
                candidates = data.get("candidates", [])

                if not candidates:
                    return "I could not generate an answer right now."

                parts = candidates[0].get("content", {}).get("parts", [])

                if not parts:
                    return "I could not generate an answer right now."

                return parts[0].get("text", "").strip()

            except requests.exceptions.RequestException as error:
                last_error = str(error)
                time.sleep(2 + attempt * 2)

        raise RuntimeError(
            "Gemini is temporarily unavailable due to high demand. Please try again in a few minutes."
        ) from RuntimeError(str(last_error))


class OpenAIProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.environ.get("OPENAI_API_KEY")
        self.model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is missing")

    def generate_answer(self, prompt: str) -> str:
        url = "https://api.openai.com/v1/responses"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "input": prompt,
            "temperature": 0.4,
            "max_output_tokens": 1200,
        }

        last_error = None

        for attempt in range(3):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=45,
                )

                if response.status_code in [429, 500, 502, 503, 504]:
                    last_error = response.text
                    time.sleep(2 + attempt * 2)
                    continue

                if not response.ok:
                    raise RuntimeError(
                        f"OpenAI API failed with status {response.status_code}: {response.text}"
                    )

                data = response.json()

                if data.get("output_text"):
                    return data["output_text"].strip()

                output = data.get("output", [])
                for item in output:
                    content = item.get("content", [])
                    for part in content:
                        if part.get("type") in ["output_text", "text"]:
                            text = part.get("text", "")
                            if text:
                                return text.strip()

                return "I could not generate an answer right now."

            except requests.exceptions.RequestException as error:
                last_error = str(error)
                time.sleep(2 + attempt * 2)

        raise RuntimeError(
            "OpenAI is temporarily unavailable or rate-limiting requests. Please try again later."
        ) from RuntimeError(str(last_error))


class ClaudeProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.environ.get("ANTHROPIC_API_KEY")
        self.model = os.environ.get("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")

        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is missing")

    def generate_answer(self, prompt: str) -> str:
        url = "https://api.anthropic.com/v1/messages"

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "max_tokens": 1200,
            "temperature": 0.4,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        }

        last_error = None

        for attempt in range(3):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=45,
                )

                if response.status_code in [429, 500, 502, 503, 504]:
                    last_error = response.text
                    time.sleep(2 + attempt * 2)
                    continue

                if not response.ok:
                    raise RuntimeError(
                        f"Claude API failed with status {response.status_code}: {response.text}"
                    )

                data = response.json()
                content = data.get("content", [])

                for item in content:
                    if item.get("type") == "text":
                        text = item.get("text", "")
                        if text:
                            return text.strip()

                return "I could not generate an answer right now."

            except requests.exceptions.RequestException as error:
                last_error = str(error)
                time.sleep(2 + attempt * 2)

        raise RuntimeError(
            "Claude is temporarily unavailable or rate-limiting requests. Please try again later."
        ) from RuntimeError(str(last_error))


class OpenAICompatibleProvider(BaseLLMProvider):
    """
    Works for providers that support OpenAI-style Chat Completions API,
    for example OpenRouter, Groq, Together, Fireworks, etc.

    Required env:
    OPENAI_COMPATIBLE_API_KEY
    OPENAI_COMPATIBLE_BASE_URL
    OPENAI_COMPATIBLE_MODEL
    """

    def __init__(self):
        self.api_key = os.environ.get("OPENAI_COMPATIBLE_API_KEY")
        self.base_url = os.environ.get("OPENAI_COMPATIBLE_BASE_URL")
        self.model = os.environ.get("OPENAI_COMPATIBLE_MODEL")

        if not self.api_key:
            raise ValueError("OPENAI_COMPATIBLE_API_KEY is missing")

        if not self.base_url:
            raise ValueError("OPENAI_COMPATIBLE_BASE_URL is missing")

        if not self.model:
            raise ValueError("OPENAI_COMPATIBLE_MODEL is missing")

    def generate_answer(self, prompt: str) -> str:
        url = self.base_url.rstrip("/") + "/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            "temperature": 0.4,
            "max_tokens": 1200,
        }

        last_error = None

        for attempt in range(3):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=45,
                )

                if response.status_code in [429, 500, 502, 503, 504]:
                    last_error = response.text
                    time.sleep(2 + attempt * 2)
                    continue

                if not response.ok:
                    raise RuntimeError(
                        f"OpenAI-compatible API failed with status {response.status_code}: {response.text}"
                    )

                data = response.json()
                choices = data.get("choices", [])

                if not choices:
                    return "I could not generate an answer right now."

                message = choices[0].get("message", {})
                return message.get("content", "").strip()

            except requests.exceptions.RequestException as error:
                last_error = str(error)
                time.sleep(2 + attempt * 2)

        raise RuntimeError(
            "The selected AI provider is temporarily unavailable or rate-limiting requests."
        ) from RuntimeError(str(last_error))


def get_available_providers() -> list[BaseLLMProvider]:
    providers = []

    if os.environ.get("OPENAI_API_KEY"):
        providers.append(OpenAIProvider())

    if os.environ.get("ANTHROPIC_API_KEY"):
        providers.append(ClaudeProvider())

    if os.environ.get("GEMINI_API_KEY"):
        providers.append(GeminiProvider())

    if (
        os.environ.get("OPENAI_COMPATIBLE_API_KEY")
        and os.environ.get("OPENAI_COMPATIBLE_BASE_URL")
        and os.environ.get("OPENAI_COMPATIBLE_MODEL")
    ):
        providers.append(OpenAICompatibleProvider())

    return providers


class AutoProvider(BaseLLMProvider):
    def __init__(self):
        self.providers = get_available_providers()

        if not self.providers:
            raise ValueError(
                "No AI provider key found. Add OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, or OPENAI_COMPATIBLE_API_KEY."
            )

    def generate_answer(self, prompt: str) -> str:
        last_error = None

        for provider in self.providers:
            try:
                return provider.generate_answer(prompt)
            except Exception as error:
                last_error = error
                continue

        raise RuntimeError(
            "All configured AI providers are currently unavailable or rate-limiting requests. Please try again later."
        ) from last_error


def get_llm_provider() -> BaseLLMProvider:
    provider = os.environ.get("LLM_PROVIDER", "auto").lower()

    if provider == "auto":
        return AutoProvider()

    if provider == "gemini":
        return GeminiProvider()

    if provider == "openai":
        return OpenAIProvider()

    if provider == "claude":
        return ClaudeProvider()

    if provider in ["compatible", "openai_compatible"]:
        return OpenAICompatibleProvider()

    raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")