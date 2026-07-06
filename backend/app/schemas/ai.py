from typing import Any

from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str


class BriefRequest(BaseModel):
    brief: str


class AIResult(BaseModel):
    result: Any
