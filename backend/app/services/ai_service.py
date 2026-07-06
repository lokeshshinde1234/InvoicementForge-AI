from abc import ABC, abstractmethod
from typing import Any

from app.core.config import get_settings


class AIProvider(ABC):
    @abstractmethod
    async def complete_json(self, system: str, user: str) -> Any:
        raise NotImplementedError


class OpenAIProvider(AIProvider):
    async def complete_json(self, system: str, user: str) -> Any:
        settings = get_settings()
        if not settings.openai_api_key:
            return {"mock": True, "system": system, "prompt": user}
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.chat.completions.create(
            model=settings.openai_model,
            response_format={"type": "json_object"},
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        )
        return response.choices[0].message.content


class AIService:
    def __init__(self, provider: AIProvider | None = None):
        self.provider = provider or OpenAIProvider()

    async def invoice_from_text(self, prompt: str) -> Any:
        return await self.provider.complete_json(
            "Extract invoice data as JSON with client_name, items, quantities, prices, gst_percent.",
            prompt,
        )

    async def summarize_invoice(self, invoice) -> Any:
        return await self.provider.complete_json("Summarize this invoice in 2-3 sentences as JSON.", str(invoice.__dict__))

    async def detect_missing_fields(self, invoice) -> Any:
        return await self.provider.complete_json("Return missing or inconsistent invoice fields as a JSON list.", str(invoice.__dict__))

    async def payment_reminder_message(self, invoice) -> Any:
        return await self.provider.complete_json("Draft a polite payment reminder email as JSON.", str(invoice.__dict__))

    async def generate_proposal(self, brief: str) -> Any:
        return await self.provider.complete_json("Draft a proposal as JSON with title and content.", brief)

    async def monthly_revenue_report(self, context: dict) -> Any:
        return await self.provider.complete_json("Write a concise monthly revenue report as JSON.", str(context))


ai_service = AIService()

